import { ConnectionRepository } from './connection-repository';
import { GameRepository } from './game-repository';
import { RoomRepository } from './room-repository';
import { UserRepository } from './user-repository';

type TDataBase = {
  connections: ConnectionRepository;
  users: UserRepository;
  rooms: RoomRepository;
  games: GameRepository;
};
let db: TDataBase;
const initDb = () => {
  db = {
    users: new UserRepository(),
    connections: new ConnectionRepository(),
    rooms: new RoomRepository(),
    games: new GameRepository(),
  };
};

export { db, initDb, TDataBase };
