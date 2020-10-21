/**
 * Dependência necessária para o typeorm
 * Necessário principalmente por causa do decorator
 */
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
// API que irá se comunicar com React necessida do CORS
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from '@config/upload';

import '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';
// import do container para injeção de dependência
import '@shared/container';

const app = express();

/** Deve ser colocado após o app
 *
 * CORS - irá evitar que sites não confiavéis acessem a aplicação (aplicações web - browsers)
 */
app.use(cors());

app.use(express.json());
// Servindo arquivo estáticos
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

// Middleware para tratativa de erros
// Deve ser colocado depois do app.use(routes);
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Para erros conhecidos
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  // Erros inesperados
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
