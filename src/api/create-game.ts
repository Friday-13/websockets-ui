import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import stringifyResponse from '../utils/stringify-response';
import { sendPersonal, sendToAll } from '../ws-service/ws-server';
import { TMessage } from './message-map';
import { IUpdateRoomResponse } from './room-message-map';

const generateCreateGameMessage = (
  gameId: string | number,
  userId: string | number
) => {
  const data: TMessage<'create_game', 'response'> = {
    id: 0,
    type: 'create_game',
    data: {
      idGame: gameId,
      idPlayer: userId,
    },
  };
  return data;
};

const createGameHandler = (
  db: TDataBase,
  userId1: string | number,
  userId2: string | number
) => {
  const game = db.games.create({ playerId1: userId1, playerId2: userId2 });
  [userId1, userId2].forEach((userId) => {
    const connection = db.connections.getByUserId(userId);
    if (connection === null) {
      throw new DbError(
        'recErr',
        `There's no connection with user id ${userId}`
      );
    }
    const message = generateCreateGameMessage(game.id, userId);
    const messageString = stringifyResponse(message);
    sendPersonal(messageString, connection.ws);
  });
};

const createGame = (userId1: string | number, userId2: string | number) => {
  const db = getDb();
  createGameHandler(db, userId1, userId2);
};

export { createGame as default };
