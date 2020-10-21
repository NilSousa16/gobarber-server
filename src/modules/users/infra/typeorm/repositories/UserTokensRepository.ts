import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository{
  private ormRepository: Repository<UserToken>;

  constructor() {
    // Criação do repositório
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    // Por receber um paramêtro ele já procura pelo id sem a necessidade de usar where
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    })

    try {
      await this.ormRepository.save(userToken)
    } catch (error) {
      console.log(error);
    }


    return userToken;
  }

}

export default UserTokensRepository;
