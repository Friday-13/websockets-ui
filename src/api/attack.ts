import {
  IGame,
  IPlayer,
  IShipCell,
  IShipState,
  TFieldCell,
} from '../db/game-repository';
import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import IPosition from '../types/iposition';
import sendInsideGame from '../utils/send-inside-game';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import { finish } from './finish';
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
): TAttackStatus | null => {
  const target = getTarget(field, position);

  if (target === null) {
    return 'miss';
  }

  const targetCell = target.cells.find(
    (cell) => cell.x === position.x && cell.y === position.y
  ) as IShipCell;

  if (targetCell.isHitted) {
    return null;
  }

  target.hp -= 1;
  targetCell.isHitted = true;
  if (target.hp > 0) {
    return 'shot';
  }
  return 'killed';
};

const isGameFinished = (player: IPlayer) => {
  return !player.gameState.ships.some((ship) => ship.hp > 0);
};

export const performAttack = (
  db: TDataBase,
  data: TMessage<'attack', 'request'>
) => {
  const gameId = data.data.gameId;
  const game = getGame(db, gameId);

  if (!isYourTurn(game, data.data.indexPlayer)) {
    return null;
  }
  const [currentPlayer, enemyPlayer] = getPlayerPositions(game);
  const position: IPosition = { x: data.data.x, y: data.data.y };

  const responseData: IAttackResponse = {
    currentPlayer: currentPlayer.id,
    position: position,
    status: 'miss',
  };

  const attackResult = getAttackResult(enemyPlayer.gameState.field, position);
  if (attackResult === null) {
    return null;
  }
  responseData.status = attackResult;

  const response: TMessage<'attack', 'response'> = {
    id: 0,
    type: 'attack',
    data: responseData,
  };
  sendInsideGame(game, response, db);
  return { attackResult, position, enemyPlayer, currentPlayer, game };
};

const getNeighborCells = (field: TFieldCell[][], position: IPosition) => {
  const neighborPositions: IPosition[] = [];
  for (let i = -1; i < 2; i += 1) {
    for (let j = -1; j < 2; j += 1) {
      if (i === 0 && j === 0) {
        continue;
      }

      const newPosition = {
        x: position.x + i,
        y: position.y + j,
      };

      if (newPosition.x < 0 || newPosition.x >= field.length) {
        continue;
      }
      if (newPosition.y < 0 || newPosition.y >= field.length) {
        continue;
      }
      if (field[newPosition.y][newPosition.x] !== null) {
        continue;
      }
      neighborPositions.push(newPosition);
    }
  }
  return neighborPositions;
};

const attackNeighborCells = (
  currentPlayer: IPlayer,
  enemyPlayer: IPlayer,
  targetPosition: IPosition,
  game: IGame
) => {
  const db = getDb();
  const enemyField = enemyPlayer.gameState.field;
  const enemyShip = enemyField[targetPosition.y][
    targetPosition.x
  ] as IShipState;
  const enemyCells = enemyShip.cells;
  const cellsAround: IPosition[] = [];
  for (const cell of enemyCells) {
    cellsAround.push(...getNeighborCells(enemyField, { x: cell.x, y: cell.y }));
  }
  getNeighborCells(enemyField, targetPosition);
  for (const cell of cellsAround) {
    const response: TMessage<'attack', 'response'> = {
      data: {
        position: cell,
        currentPlayer: currentPlayer.id,
        status: 'miss',
      },
      id: 0,
      type: 'attack',
    };
    sendInsideGame(game, response, db);
  }
};

export const attackEffect = (
  attackResult: TAttackStatus,
  targetPosition: IPosition,
  currentPlayer: IPlayer,
  enemyPlayer: IPlayer,
  game: IGame
) => {
  if (attackResult === 'killed') {
    attackNeighborCells(currentPlayer, enemyPlayer, targetPosition, game);
    if (isGameFinished(enemyPlayer)) {
      finish(game, currentPlayer);
      return;
    }
  }

  if (attackResult === 'miss') {
    turn(game.id, 'next');
  } else {
    turn(game.id, 'current');
  }
};

export const attackHandler: TRouteHandlerCore<'attack'> = ({ db, data }) => {
  const performedAttack = performAttack(db, data);
  if (performedAttack !== null) {
    const { attackResult, position, enemyPlayer, currentPlayer, game } =
      performedAttack;
    attackEffect(attackResult, position, currentPlayer, enemyPlayer, game);
  }
};
export const attackRoute = new Route({
  name: 'attack',
  handlerCore: attackHandler,
});
