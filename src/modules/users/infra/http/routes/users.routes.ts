import { Router } from 'express';

import { container } from 'tsyringe';

import multer from 'multer';

import uploadConfig from '@config/upload';

// Para validação no back-end
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';

import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  }),
  usersController.create
);

// Funciona como middleware - upload.single(<nome do campo de vai conter a imagem>)
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update);

export default usersRouter;
