import { ConnectionRepository } from './connection-repository';
import { UserRepository } from './user-repository';

type TDataBase = {
  connections: ConnectionRepository;
  users: UserRepository;
  // games: Gamerepository
};
let db: TDataBase;
const initDb = () => {
  db = { users: new UserRepository(), connections: new ConnectionRepository() };
};

export { db, initDb, TDataBase };
