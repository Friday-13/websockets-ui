import { WebSocket } from 'ws';
import getDb from '../db/get-db';
import stringifyResponse from '../utils/stringify-response';
import { TRouteHandlerCore } from '../ws-service/route';
import { broadcast } from '../ws-service/ws-server';
import { TMessage } from './message-map';

const updateWinnersHandler: TRouteHandlerCore<'update_winners'> = ({ db }) => {
  const users = db.users.getAll();
  users.sort((userA, userB) => userB.wins - userA.wins);
  const response: TMessage<'update_winners', 'response'> = {
    type: 'update_winners',
    id: 0,
    data: users,
  };
  const responseString = stringifyResponse(response);
  broadcast(responseString);
};

export const updateWinners = (ws: WebSocket) => {
  const db = getDb();
  const data: TMessage<'update_winners', 'request'> = {
    type: 'update_winners',
    id: 0,
    data: null,
  };
  updateWinnersHandler({ db, data, ws });
};
