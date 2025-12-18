import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserDAO } from '../../DAO/UserDAO';
import { User } from '../../database/entities/User.entity';
import { UnauthorizedError } from '../../helpers/Errors/UnauthorizedError';
import { validation } from '../../shared/middlewares/Validation';
import { JWTService } from '../../shared/services/JWTService';
import { PasswordCrypto } from '../../shared/services/PasswordCrypto';
import * as yup from 'yup';

interface IBodyProps extends Omit<User, 'id' | 'isActive' | 'username' | 'name' | 'posts'> { }

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    password: yup.string().required().min(6),
    email: yup.string().required().email().min(5),
  })),
}));

export class SigninController {
  public static async show(req: Request, res: Response) {
    const userId = req.headers["idUsuario"];

    if (!parseInt(userId as string)) throw new UnauthorizedError();

    const user = await UserDAO.getById(+userId!);

    if (!user) throw new UnauthorizedError();

    res.status(200).json(user);
  }

  public static async create(req: Request<{}, {}, IBodyProps>, res: Response) {
    const body = req.body;
    const user = await UserDAO.getByEmail(body.email);

    if (!user) throw new UnauthorizedError("Email ou senha inválidos");

    const passwordMatch = await PasswordCrypto.verifyPassword(body.password, user.password);

    if (!passwordMatch) throw new UnauthorizedError("Email ou senha inválidos");

    const accessToken = JWTService.sign({ uid: user.id });

    if (accessToken === 'JWT_SECRET_NOT_FOUND') throw new UnauthorizedError("Erro ao gerar token");

    res.status(StatusCodes.OK).json({ accessToken, userId: user.id, email: user.email } );
  }
}
