import IBaseModel from './ibase-model';
import RepositoryBase from './repository-base';
import DbError from '../errors/db-error';
import getNewRoomId from './get-new-room-id';
import getNewGameId from './get-new-game-id';

export interface IGameData {
  playerId1: string | number;
  playerId2: string | number;
}

export interface IGame extends IGameData {
  id: number | string;
}

export class GameModel implements IBaseModel {
  id: string | number;
  playerId1: string | number;
  playerId2: string | number;

  constructor({ playerId1, playerId2 }: IGameData) {
    this.id = getNewGameId();
    this.playerId1 = playerId1;
    this.playerId2 = playerId2;
  }
}

export class GameRepository extends RepositoryBase<GameModel> {
  create(data: IGameData) {
    const connection = new GameModel(data);
    this.records.push(connection);
    return connection;
  }

  update(data: IGame) {
    const game = this.getById(data.id);
    if (game) {
      game.playerId1 = data.playerId1;
      game.playerId2 = data.playerId2;
    } else {
      throw new DbError('recErr', 'Game was deleted or unexists');
    }
    return game;
  }
}
