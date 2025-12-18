import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../database/entities/User.entity';
import { JWTService } from '../../shared/services/JWTService';

function generateRandomUsername() {
  const prefix = "anonimo";
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomNum}`;
}

export const SignupController = {
  async create(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
      }

      const usuarioRepo = AppDataSource.getRepository(User);
      const emailExistente = await usuarioRepo.findOne({ where: { email } });

      if (emailExistente) {
        return res.status(400).json({ error: "Email já cadastrado." });
      }

      const username = generateRandomUsername();
      const name = `Anonimo${username.slice(7)}`;
      const hashedPassword = await bcryptjs.hash(password, 10);

      const novoUsuario = usuarioRepo.create({
        email,
        password: hashedPassword,
        username,
        name,
      });

      await usuarioRepo.save(novoUsuario);

      const accessToken = JWTService.sign({ uid: novoUsuario.id });

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: {
          id: novoUsuario.id,
          email: novoUsuario.email,
          username: novoUsuario.username,
          name: novoUsuario.name,
        },
        accessToken,
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  },
};
