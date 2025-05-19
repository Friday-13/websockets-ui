import getDb from '../db/get-db';
import DbError from '../errors/db-error';

const getUserById = (id: string | number) => {
  const db = getDb();
  const user = db.users.getById(id);
  if (user === null) {
    throw new DbError(
      'recErr',
      `Invalid reference: user ID ${id} is missing in the users table`
    );
  }
  return user;
};

export { getUserById as default };
