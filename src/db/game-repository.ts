import IBaseModel from './ibase-model';
import RepositoryBase from './repository-base';
import DbError from '../errors/db-error';
import getNewRoomId from './get-new-room-id';
import generateEmptyField from '../utils/generate-empty-field';
import IShip from '../types/iship';
import IPosition from '../types/iposition';

export interface IPlayer {
  id: string | number;
  gameState: IGameState;
}

export interface IShipCell extends IPosition {
  isHitted: boolean;
}

export interface IShipState extends IShip {
  hp: number;
  cells: IShipCell[];
}

export type TFieldCell = null | IShipState;
interface IGameState {
  field: TFieldCell[][];
  ships: IShipState[];
}

export interface IGameData {
  playerId1: string | number;
  playerId2: string | number;
}

export interface IGame {
  id: number | string;
  player1: IPlayer;
  player2: IPlayer;
}

export class GameModel implements IBaseModel {
  id: string | number;
  player1: IPlayer;
  player2: IPlayer;

  constructor({ playerId1, playerId2 }: IGameData) {
    this.id = getNewRoomId();
    this.player1 = {
      id: playerId1,
      gameState: GameModel.initGameState(),
    };
    this.player2 = {
      id: playerId2,
      gameState: GameModel.initGameState(),
    };
  }
  static initGameState(): IGameState {
    return { field: generateEmptyField(), ships: [] };
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
      game.player1 = data.player1;
      game.player2 = data.player2;
    } else {
      throw new DbError('recErr', 'Game was deleted or unexists');
    }
    return game;
  }
}
