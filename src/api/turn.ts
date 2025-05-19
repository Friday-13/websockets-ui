import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import sendInsideGame from '../utils/send-inside-game';
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
  game.currentPlayer = nextPlayerId;
  const response: TMessage<'turn', 'response'> = {
    type: 'turn',
    id: 0,
    data: {
      currentPlayer: nextPlayerId,
    },
  };
  sendInsideGame(game, response, db);
};

export const turn = (gameId: string | number, nextPlayer: TNextPlayer) => {
  const db = getDb();
  turnHandler(db, gameId, nextPlayer);
};
