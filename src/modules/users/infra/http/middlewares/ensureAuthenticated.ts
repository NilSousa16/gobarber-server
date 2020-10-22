import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
   const authHeader = request.headers.authorization;

   if(!authHeader) {
      throw new AppError('JWT token is missing', 401);
   }

   // separa a string por espaço em um array
   // desestruturação descarta 1 posição
   const [, token] = authHeader.split(' ');

   //verifica se um token é valido
   //usa o secret usado para criar o token
   // try catch para disparar erro no formado desejado
   try{
      const decoded = verify(token, authConfig.jwt.secret);

      // Forçando o tipo TokenPayload para o retorno de
      // verify que não possui um tipo definido
      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub,
      }

      return next();
   } catch (err) {
    throw new AppError('Invalid JWT token', 401);
   }

}
