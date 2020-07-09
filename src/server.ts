/**
 * Dependência necessária para o typeorm
 * Necessário principalmente por causa do decorator
 */
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'

import routes from './routes';
import uploadConfig from './config/upload';

import './database'
import AppError from './errors/AppError';

const app = express();

app.use(express.json());
// Servindo arquivo estáticos
app.use('/files', express.static(uploadConfig.directory));
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
