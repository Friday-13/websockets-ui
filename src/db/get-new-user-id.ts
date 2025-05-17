import getDb from './get-db';

const getNewUserId = () => {
  const db = getDb();
  return db.users.records.length;
};

export { getNewUserId as default };
