import IBaseModel from './ibase-model';
import RepositoryBase from './repository-base';
import DbError from '../errors/db-error';
import getNewRoomId from './get-new-room-id';

export interface IRoomData {
  hostId: string | number;
  guestId?: string | number;
}

export interface IRoom extends IRoomData {
  id: string;
}

export class RoomModel implements IBaseModel {
  id: number;
  hostId: string | number;
  guestId?: string | number;

  constructor({ hostId }: IRoomData) {
    this.id = getNewRoomId();
    this.hostId = hostId;
  }
}

export class RoomRepository extends RepositoryBase<RoomModel> {
  create(roomData: IRoomData) {
    const connection = new RoomModel(roomData);
    this.records.push(connection);
    return connection;
  }

  update(roomData: IRoom) {
    const room = this.getById(roomData.id);
    if (room) {
      room.hostId = roomData.id;
      room.guestId = roomData.guestId;
    } else {
      throw new DbError('recErr', 'Room was delete or unexists');
    }
    return room;
  }
}
