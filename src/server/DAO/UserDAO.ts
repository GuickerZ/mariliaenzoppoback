import { AppDataSource } from "../database/data-source";
import { User } from "../database/entities/User.entity";
import { PasswordCrypto } from "../shared/services";

const userRepository = AppDataSource.getRepository(User);

export class UserDAO {
  public static async create(user: Omit<User, 'id'>) {
    const hashedPassword = await PasswordCrypto.hashPassword(user.password);

    return await userRepository.save(userRepository.create({ ...user, password: hashedPassword }));
  }

  public static async getByEmail(email: User["email"]) {
    return await userRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  public static async getById(id: User["id"]) {
    return await userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'email'] // exclude password
    });
  }
}