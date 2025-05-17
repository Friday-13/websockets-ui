import { UserRepository } from './user-repository';

type TDataBase = {
  users: UserRepository;
  // games: Gamerepository
};
let db: TDataBase;
const initDb = () => {
  db = { users: new UserRepository() };
};

export { db, initDb, TDataBase };
