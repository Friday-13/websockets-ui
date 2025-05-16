import { WSService } from './ws-server/ws-server';

const WS_PORT = 3000;

export default class App {
  port: number;
  // server:
  constructor() {
    this.port = WS_PORT | 3000;
  }

  start() {
    //TODO: create router
    //TODO: add routes to router
    new WSService({ port: this.port });
    //TODO: add router to routes
  }

  stop() {}
}
