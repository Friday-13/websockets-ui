import { IGame, IPlayer } from '../db/game-repository';
import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import getUserById from '../utils/get-user-by-id';
import sendInsideGame from '../utils/send-inside-game';
import { TMessage } from './message-map';
import { updateWinners } from './update-winners';

const finishHandler = (db: TDataBase, game: IGame, winner: IPlayer) => {
  const winnerUser = getUserById(winner.id);
  winnerUser.wins += 1;

  const response: TMessage<'finish', 'response'> = {
    id: 0,
    data: {
      winPlayer: winner.id,
    },
    type: 'finish',
  };

  sendInsideGame(game, response, db);
  updateWinners();
};

export const finish = (game: IGame, winner: IPlayer) => {
  const db = getDb();
  finishHandler(db, game, winner);
};
