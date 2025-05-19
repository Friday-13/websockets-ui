import { IShipCell } from '../db/game-repository';
import DbError from '../errors/db-error';
import sendInsideGame from '../utils/send-inside-game';
import stringifyResponse from '../utils/stringify-response';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import { sendPersonal } from '../ws-service/ws-server';
import { IAttackResponse } from './game-message-map';
import { TMessage, TMessageType } from './message-map';
import { turn } from './turn';

const attackHandler: TRouteHandlerCore<'attack'> = ({ db, data }) => {
  const gameId = data.data.gameId;
  const cuurentPlayerId = data.data.indexPlayer;
  const game = db.games.getById(gameId);
  if (!game) {
    throw new DbError('idErr', `There's no game id ${gameId}`);
  }

  const [currentPlayer, enemyPlayer] =
    game.player1.id === cuurentPlayerId
      ? [game.player1, game.player2]
      : [game.player2, game.player1];

  const responseData: IAttackResponse = {
    currentPlayer: currentPlayer.id,
    position: { x: data.data.x, y: data.data.y },
    status: 'miss',
  };
  const enemyShip = enemyPlayer.gameState.field[data.data.y][data.data.x];
  if (enemyShip !== null) {
    if (enemyShip.hp > 0) {
      const currentCell = enemyShip.cells.find(
        (cell) => cell.x === data.data.x && cell.y === data.data.y
      ) as IShipCell;
      if (!currentCell.isHitted) {
        currentCell.isHitted = true;
        enemyShip.hp -= 1;
        responseData.status = enemyShip.hp === 0 ? 'killed' : 'shot';
      }
    }
  }

  const response: TMessage<'attack', 'response'> = {
    id: 0,
    type: 'attack',
    data: responseData,
  };
  sendInsideGame(game, response, db);

  if (responseData.status === 'miss') {
    turn(game.id, 'next');
  } else {
    turn(game.id, 'current');
  }
};
export const attackRoute = new Route({
  name: 'attack',
  handlerCore: attackHandler,
});
