import { getRepository } from 'typeorm';
import path from 'path';
// File system do node
import fs from 'fs';

import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';
import User from '../models/User';

interface Request{
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({user_id, avatarFileName}: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if(!user){
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if(user.avatar){
      // Juntas o caminho e nome do arquivo
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // fs.promises - Garante que as funções sejam promises
      // stat - retorna status do arquivo se ele existir
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if(userAvatarFileExists){
        // Deleta arquivo
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;