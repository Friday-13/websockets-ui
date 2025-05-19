import { initDb, db } from './init-db';
const getDb = () => {
  if (db === undefined) {
    initDb();
  }
  return db;
};

export { getDb as default };
