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

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large';
}

interface IStartGameResponse {
  ships: IShip[];
  currentPlayerIndex: number | string;
}
