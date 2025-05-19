import { IGame, IShipCell, TFieldCell } from '../db/game-repository';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import IPosition from '../types/iposition';
import sendInsideGame from '../utils/send-inside-game';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import { IAttackResponse, TAttackStatus } from './game-message-map';
import { TMessage } from './message-map';
import { turn } from './turn';

const getGame = (db: TDataBase, gameId: string | number) => {
  const game = db.games.getById(gameId);
  if (!game) {
    throw new DbError('idErr', `There's no game id ${gameId}`);
  }
  return game;
};

const getPlayerPositions = (game: IGame) => {
  return game.player1.id === game.currentPlayer
    ? [game.player1, game.player2]
    : [game.player2, game.player1];
};

const isYourTurn = (game: IGame, playerId: string | number) => {
  return game.currentPlayer === playerId;
};
const getTarget = (field: TFieldCell[][], position: IPosition) => {
  return field[position.y][position.x];
};

const getAttackResult = (
  field: TFieldCell[][],
  position: IPosition
): TAttackStatus => {
  const target = getTarget(field, position);

  if (target === null || target.hp <= 0) {
    return 'miss';
  }

  const targetCell = target.cells.find(
    (cell) => cell.x === position.x && cell.y === position.y
  ) as IShipCell;

  if (targetCell.isHitted) {
    return 'miss';
  }

  target.hp -= 1;
  targetCell.isHitted = true;
  if (target.hp > 0) {
    return 'shot';
  }
  return 'killed';
};

const attackHandler: TRouteHandlerCore<'attack'> = ({ db, data }) => {
  const gameId = data.data.gameId;
  const game = getGame(db, gameId);

  if (!isYourTurn(game, data.data.indexPlayer)) {
    return;
  }
  const [currentPlayer, enemyPlayer] = getPlayerPositions(game);
  const position: IPosition = { x: data.data.x, y: data.data.y };

  const responseData: IAttackResponse = {
    currentPlayer: currentPlayer.id,
    position: position,
    status: 'miss',
  };

  const attackResult = getAttackResult(enemyPlayer.gameState.field, position);
  responseData.status = attackResult;

  const response: TMessage<'attack', 'response'> = {
    id: 0,
    type: 'attack',
    data: responseData,
  };
  sendInsideGame(game, response, db);

  if (attackResult === 'miss') {
    turn(game.id, 'next');
  } else {
    turn(game.id, 'current');
  }
};
export const attackRoute = new Route({
  name: 'attack',
  handlerCore: attackHandler,
});
