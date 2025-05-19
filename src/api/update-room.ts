import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';
import getUserById from '../utils/get-user-by-id';
import stringifyResponse from '../utils/stringify-response';
import { sendToAll } from '../ws-service/ws-server';
import { TMessage } from './message-map';
import { IUpdateRoomResponse } from './room-message-map';

const generateAvaliableRooms = (db: TDataBase) => {
  const allRooms = db.rooms.getAll();
  const avaliableRoomsData: IUpdateRoomResponse[] = [];
  for (const room of allRooms) {
    if (room.guestId !== undefined) continue;
    const roomHost = getUserById(room.hostId);
    const avaliableRoom: IUpdateRoomResponse = {
      roomId: room.id,
      roomUsers: [
        {
          name: roomHost.name,
          index: roomHost.id,
        },
      ],
    };
    avaliableRoomsData.push(avaliableRoom);
  }
  return avaliableRoomsData;
};

const updateRoomHandler = (db: TDataBase) => {
  const roomData = generateAvaliableRooms(db);
  const messageData: TMessage<'update_room', 'response'> = {
    type: 'update_room',
    id: 0,
    data: roomData,
  };
  const dataString = stringifyResponse(messageData);
  sendToAll(dataString);
};

const updateRoom = () => {
  const db = getDb();
  updateRoomHandler(db);
};

export { updateRoom as default };
