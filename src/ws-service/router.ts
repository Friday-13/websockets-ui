import { TMessage, TMessageType } from '../api/message-map';
import Route from './route';

export default class Router {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: Map<string, Route<any>>;
  constructor() {
    this.routes = new Map();
  }

  addRoute<T extends TMessageType>(route: Route<T>) {
    this.routes.set(route.name, route);
  }

  handler<T extends TMessageType>(name: T, data: TMessage<T, 'request'>) {
    const route = this.routes.get(name);
    if (!route) {
      //eslint-disable-next-line no-console
      console.error(`Route ${name} doesn't exist`);
      //TODO: add error throwing
      return;
    }
    const result = route.handlerCore(data);
    return result;
  }
}
