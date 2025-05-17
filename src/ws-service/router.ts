import Route from './route';

export default class Router {
  routes: Map<string, Route>;
  constructor() {
    this.routes = new Map();
  }

  addRoute(route: Route) {
    this.routes.set(route.name, route);
  }

  handler(name: string, data: unknown) {
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
