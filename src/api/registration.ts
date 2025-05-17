import { TDataBase } from '../db/init-db';
import { UserModel } from '../db/user-repository';
import AuthError from '../errors/auth-error';
import InputValidationError from '../errors/input-validation-error';
import Route from '../ws-service/route';
import { TMessage } from './message-map';

const validateName = (name: string) => {
  if (name.length < 5) {
    throw new InputValidationError(
      'Name too short: must be 5 or more characters'
    );
  }
};
const validatePassword = (password: string) => {
  if (password.length < 5) {
    throw new InputValidationError(
      'Password too short: must be 5 or more characters'
    );
  }
};

const regHandler = ({
  data,
  db,
}: {
  data: TMessage<'reg', 'request'>;
  db: TDataBase;
}): TMessage<'reg', 'response'> => {
  const { name, password } = data.data;
  let errorText = '';
  let error = false;
  let user: UserModel | null = null;
  try {
    validateName(password);
    validatePassword(name);
    user = db.users.getByName(name);
    if (user === null) {
      user = db.users.create({ name, password });
    } else {
      if (password !== user.password) {
        throw new AuthError('Incorrect password');
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      errorText = err.message;
      error = true;
    } else {
      errorText = String(err);
      error = true;
    }
  }
  const response: TMessage<'reg', 'response'> = {
    type: data.type,
    id: data.id,
    data: {
      name: name,
      error: error,
      errorText: errorText,
      index: user?.id || '',
    },
  };
  return response;
};
export const regRoute = new Route({ name: 'reg', handlerCore: regHandler });
