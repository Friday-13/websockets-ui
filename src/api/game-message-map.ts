export interface IGameMessageMap {
  attack: {
    request: IAttackRequest;
    response: IAttackResponse;
  };
  randomAttack: {
    request: null;
    response: IRandomAttackResponse;
  };

  turn: {
    request: null;
    response: ITurnResponse;
  };
  finish: {
    request: null;
    response: IFinishResponse;
  };
}

interface IAttackRequest {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

export interface IAttackResponse {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number | string;
  status: 'miss' | 'killed' | 'shot';
}

interface IRandomAttackResponse {
  gameId: number | string;
  indexPlayer: number | string;
}

interface ITurnResponse {
  currentPlayer: number | string;
}

interface IFinishResponse {
  winPlayer: number | string;
}
