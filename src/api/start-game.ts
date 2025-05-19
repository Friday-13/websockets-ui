import { IGame } from '../db/game-repository';
import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import stringifyResponse from '../utils/stringify-response';
import { sendPersonal } from '../ws-service/ws-server';
import { TMessage } from './message-map';

const startGameHandler = (db: TDataBase, game: IGame) => {
  if (
    game.player1.gameState.ships.length === 0 ||
    game.player2.gameState.ships.length === 0
  ) {
    return;
  }

  for (const player of [game.player1, game.player2]) {
    const response: TMessage<'start_game', 'response'> = {
      type: 'start_game',
      id: 0,
      data: {
        currentPlayerIndex: player.id,
        ships: player.gameState.ships,
      },
    };
    const connection = db.connections.getByUserId(player.id);
    if (!connection) {
      throw new DbError(
        'recErr',
        `There's no connection with user id ${player.id}`
      );
    }
    const responseString = stringifyResponse(response);
    sendPersonal(responseString, connection.ws);
  }
};

export const startGame = (game: IGame) => {
  const db = getDb();
  startGameHandler(db, game);
};
