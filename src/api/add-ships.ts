import { IShipCell, IShipState, TFieldCell } from '../db/game-repository';
import DbError from '../errors/db-error';
import IPosition from '../types/iposition';
import Route, { TRouteHandlerCore } from '../ws-service/route';

const generateCells = (
  position: IPosition,
  length: number,
  direction: boolean
): IShipCell[] => {
  const cells: IShipCell[] = [];
  for (let i = 0; i < length; i += 1) {
    if (direction) {
      const ceil: IShipCell = {
        x: position.x,
        y: position.y + i,
        isHitted: false,
      };
      cells.push(ceil);
    } else {
      const ceil: IShipCell = {
        x: position.x + i,
        y: position.y,
        isHitted: false,
      };
      cells.push(ceil);
    }
  }
  return cells;
};

const updateField = (field: TFieldCell[][], shipState: IShipState) => {
  shipState.cells.forEach((cell) => {
    field[cell.y][cell.x] = shipState;
  });
  return field;
};

const addShipsHandler: TRouteHandlerCore<'add_ships'> = ({ db, _ws, data }) => {
  const [gameId, playerId] = [data.data.gameId, data.data.indexPlayer];
  const game = db.games.getById(gameId);
  if (!game) {
    throw new DbError('idErr', `There is no game  with id ${gameId}`);
  }

  let player;

  if (playerId === game.player1.id) {
    player = game.player1;
  } else {
    player = game.player2;
  }

  for (let i = 0; i < data.data.ships.length; i += 1) {
    const ship = data.data.ships[i];
    const cells = generateCells(ship.position, ship.length, ship.direction);
    const shipState: IShipState = {
      ...ship,
      hp: ship.length,
      cells: cells,
    };
    player.gameState.ships.push(shipState);
    updateField(player.gameState.field, shipState);
  }

  //TODO: add start game if
};

export const addShipsRoute = new Route({
  name: 'add_ships',
  handlerCore: addShipsHandler,
});
