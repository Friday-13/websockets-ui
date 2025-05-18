import AuthError from '../errors/auth-error';
import DbError from '../errors/db-error';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import createGame from './create-game';
import updateRoom from './update-room';

const addUserToRoomHandler: TRouteHandlerCore<'add_user_to_room'> = ({
  ws,
  db,
  data,
}) => {
  const connection = db.connections.getByWs(ws);
  if (connection === null) {
    throw new DbError('recErr', 'Requested ws connection not found');
  }
  if (connection.userId === undefined) {
    throw new AuthError('No user associated with this connection');
  }
  const room = db.rooms.getById(data.data.indexRoom);
  if (room === null) {
    throw new DbError('recErr', 'Requested room not found');
  }
  room.guestId = connection.userId;
  createGame(room.hostId, room.guestId);
  updateRoom();
};

export const addUserToRoomRoute = new Route({
  name: 'add_user_to_room',
  handlerCore: addUserToRoomHandler,
});
