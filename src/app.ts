import { regRoute } from './api/registration';
import Router from './ws-service/router';
import { WSService } from './ws-service/ws-service';

const WS_PORT = 3000;

export default class App {
  port: number;
  // server:
  constructor() {
    this.port = WS_PORT | 3000;
  }

  start() {
    const router = new Router();
    router.addRoute(regRoute);
    //TODO: add routes to router
    new WSService({ port: this.port, router });
    //TODO: add router to routes
  }

  stop() {}
}
