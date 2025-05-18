import { WebSocket } from 'ws';
import { TMessage, TMessageType } from '../api/message-map';
import getDb from '../db/get-db';
import { TDataBase } from '../db/init-db';

export interface IRouteHandlerCoreParams<T extends TMessageType> {
  data: TMessage<T, 'request'>;
  db: TDataBase;
  ws: WebSocket;
}
export type TRouteHandlerCore<T extends TMessageType> = (
  params: IRouteHandlerCoreParams<T>
) => void;
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

  handler(ws: WebSocket, data: TMessage<T, 'request'>) {
    //TODO: Add wrapper
    const db = getDb();
    return this.handlerCore({ ws, data, db });
  }
}
