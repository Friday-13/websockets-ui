import { TMessage, TMessageType } from '../api/message-map';
import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';

type TRouteHandlerCore<T extends TMessageType> = ({
  data,
  db,
}: {
  data: TMessage<T, 'request'>;
  db: TDataBase;
}) => TMessage<T, 'response'>;
interface IRouteParams<T extends TMessageType> {
  name: T;
  handlerCore: TRouteHandlerCore<T>;
}

export default class Route<T extends TMessageType> {
  name: T;
  handlerCore: TRouteHandlerCore<T>;

  constructor({ name, handlerCore }: IRouteParams<T>) {
    this.name = name;
    this.handlerCore = handlerCore;
  }

  handler(data: TMessage<T, 'request'>) {
    //TODO: Add wrapper
    const db = getDb();
    return this.handlerCore({ data, db });
  }
}
