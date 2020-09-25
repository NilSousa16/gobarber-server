import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse>{
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // compara a senha não-criptografada com a senha criptografada
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if(!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    /**
     * sign(<payload>, <keysecret>, <configs>)
     * payload - informações criptografadas, mas não seguras. Geralmente se coloca informações menos sensíveis do usuário que são usadas no front-end
     * keysecret - chave que só a aplicação pode conhecer (gere através do site md5 online com uma string aleatória)
     * configs - pode ser colocadas várias configurações, a mais importante é o subject (id do usuário que gerou o token).Permite saber qual usuário gerou o token. A outra configuração é o expiresIn: '1d'
     */

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
