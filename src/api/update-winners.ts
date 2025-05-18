import getDb from '../db/get-db';
import stringifyResponse from '../utils/stringify-response';
import { TMessage } from './message-map';
import { sendToAll } from '../ws-service/ws-server';
import { TDataBase } from '../db/init-db';

const updateWinnersHandler = (db: TDataBase) => {
  const users = db.users.getAll();
  users.sort((userA, userB) => userB.wins - userA.wins);
  const response: TMessage<'update_winners', 'response'> = {
    type: 'update_winners',
    id: 0,
    data: users,
  };
  const responseString = stringifyResponse(response);
  sendToAll(responseString);
};

export const updateWinners = () => {
  const db = getDb();
  updateWinnersHandler(db);
};
