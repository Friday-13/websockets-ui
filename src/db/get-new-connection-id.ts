import getDb from './get-db';

const getNewConnectionId = () => {
  const db = getDb();
  return db.connections.records.length;
};

export { getNewConnectionId as default };
