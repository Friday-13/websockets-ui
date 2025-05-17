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

const regHandler = (
  req: TMessage<'reg', 'request'>
): TMessage<'reg', 'response'> => {
  let errorText = '';
  let error = false;
  try {
    validateName(req.data.name);
    validatePassword(req.data.password);
    //TODO: check is user in db
    //TODO: add user to db
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
    type: req.type,
    id: req.id,
    data: {
      name: req.data.name,
      error: error,
      errorText: errorText,
      //TODO: set index from db
      index: 1,
    },
  };
  return response;
};
export const regRoute = new Route({ name: 'reg', handlerCore: regHandler });
