import { WSService } from './ws-server/ws-server';
import Route from './ws-service/route';
import Router from './ws-service/router';

const WS_PORT = 3000;

export default class App {
  port: number;
  // server:
  constructor() {
    this.port = WS_PORT | 3000;
  }

  start() {
    const router = new Router();
    const dummyRoute = new Route({
      name: 'dummy',
      handler: () => {
        //eslint-disable-next-line no-console
        console.log('Dummy route handled!');
      },
    });
    router.addRoute(dummyRoute);
    //TODO: add routes to router
    new WSService({ port: this.port });
    //TODO: add router to routes
  }

  stop() {}
}
