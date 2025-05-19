import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import stringifyResponse from '../utils/stringify-response';
import { sendPersonal } from '../ws-service/ws-server';
import { TMessage } from './message-map';

export type TNextPlayer = 'next' | 'current';

const turnHandler = (
  db: TDataBase,
  gameId: string | number,
  nextPlayer: TNextPlayer
) => {
  const game = db.games.getById(gameId);
  if (!game) {
    throw new DbError('idErr', `There's no game id ${gameId}`);
  }

  let nextPlayerId;

  if (nextPlayer === 'current') {
    nextPlayerId = game.currentPlayer;
  } else {
    const currentPlayerId = game.currentPlayer;
    if (game.player1.id === currentPlayerId) {
      nextPlayerId = game.player2.id;
    } else {
      nextPlayerId = game.player1.id;
    }
  }

  for (const player of [game.player1, game.player2]) {
    const response: TMessage<'turn', 'response'> = {
      type: 'turn',
      id: 0,
      data: {
        currentPlayer: nextPlayerId,
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

export const turn = (gameId: string | number, nextPlayer: TNextPlayer) => {
  const db = getDb();
  turnHandler(db, gameId, nextPlayer);
};
