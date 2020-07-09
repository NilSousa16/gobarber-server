import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response>{
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if(!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // compara a senha não-criptografada com a senha criptografada
    const passwordMatched = await compare(password, user.password);

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
