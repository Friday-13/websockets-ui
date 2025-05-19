import IShip from '../types/iship';

export interface IShipsMessageMap {
  add_ships: {
    request: IAddShipsRequest;
    response: null;
  };
  start_game: {
    request: null;
    response: IStartGameResponse;
  };
}

interface IAddShipsRequest {
  gameId: number | string;
  ships: IShip[];
  indexPlayer: number | string;
}

interface IStartGameResponse {
  ships: IShip[];
  currentPlayerIndex: number | string;
}
