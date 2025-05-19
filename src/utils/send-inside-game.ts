import { TMessage, TMessageMap, TMessageType } from '../api/message-map';
import { IGame } from '../db/game-repository';
import { TDataBase } from '../db/init-db';
import DbError from '../errors/db-error';
import { sendPersonal } from '../ws-service/ws-server';
import stringifyResponse from './stringify-response';

const sendInsideGame = <T extends TMessageType = TMessageType>(
  game: IGame,
  response: TMessage<T, 'response'>,
  db: TDataBase
) => {
  for (const player of [game.player1, game.player2]) {
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

export { sendInsideGame as default };
