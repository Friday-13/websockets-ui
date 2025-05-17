import { RawData } from 'ws';
import { WebSocket, WebSocketServer } from 'ws';

export interface IWSServer {
  port: number;
}

export class WSService {
  server: WebSocketServer;
  port: number;
  // router:
  constructor({ port = 3000 }: IWSServer) {
    this.port = port;
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
