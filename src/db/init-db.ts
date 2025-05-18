import { ConnectionRepository } from './connection-repository';
import { RoomRepository } from './room-repository';
import { UserRepository } from './user-repository';

type TDataBase = {
  connections: ConnectionRepository;
  users: UserRepository;
  rooms: RoomRepository;
  // games: Gamerepository
};
let db: TDataBase;
const initDb = () => {
  db = {
    users: new UserRepository(),
    connections: new ConnectionRepository(),
    rooms: new RoomRepository(),
  };
};

export { db, initDb, TDataBase };
