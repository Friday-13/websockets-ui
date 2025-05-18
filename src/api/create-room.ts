import AuthError from '../errors/auth-error';
import DbError from '../errors/db-error';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import updateRoom from './update-room';

const createRoomHandler: TRouteHandlerCore<'create_room'> = ({ ws, db }) => {
  const connection = db.connections.getByWs(ws);
  if (connection === null) {
    throw new DbError('recErr', 'Requested ws connection not found');
  }
  if (connection.userId === undefined) {
    throw new AuthError('No user associated with this connection');
  }
  db.rooms.create({ hostId: connection.userId });
  updateRoom();
};

export const createRoomRoute = new Route({
  name: 'create_room',
  handlerCore: createRoomHandler,
});
