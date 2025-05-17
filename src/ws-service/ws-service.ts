import { RawData } from 'ws';
import { WebSocket, WebSocketServer } from 'ws';
import Router from './router';

export interface IWSServer {
  port: number;
  router: Router;
}

export class WSService {
  server: WebSocketServer;
  port: number;
  router: Router;
  constructor({ port = 3000, router }: IWSServer) {
    this.port = port;
    this.router = router;
    this.server = new WebSocketServer({ port: this.port });
    this.server.on('error', this.onError.bind(this));
    this.server.on('connection', this.onConnection.bind(this));
    this.server.on('message', this.onMessage.bind(this));
  }

  onError(err: Error) {
    //eslint-disable-next-line no-console
    console.error(err);
  }

  onConnection(_ws: WebSocket) {
    //eslint-disable-next-line no-console
    console.log('new client connected');
  }

  onMessage(msg: RawData) {
    //eslint-disable-next-line no-console
    console.log(`New message: ${JSON.stringify(msg)}`);
    //TODO: prepare message properly
    //TODO: send message to router and get response
    //TODO: send response (to the same, to room, to partner, to all)
  }

  displayWsStartedParamaters() {
    //eslint-disable-next-line no-console
    console.log('[WebSocket Server Started]');
    //eslint-disable-next-line no-console
    console.log(`
  ⚙️Server URL: ws://localhost:${this.port}  
  ⚙️Port: ${this.port}  
  ⚙️Protocol: ws  
  ⚙️Status: Listening`);
  }
}
