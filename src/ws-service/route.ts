import { TMessage, TMessageType } from '../api/message-map';

type TRouteHandlerCore<T extends TMessageType> = (
  data: TMessage<T, 'request'>
) => TMessage<T, 'response'>;
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
    return this.handlerCore(data);
  }
}
