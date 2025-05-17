import { RawData } from 'ws';
import { WebSocket, WebSocketServer } from 'ws';
import Router from './router';
import { TMessage, TMessageType } from '../api/message-map';

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
    // this.server.on('message', this.onMessage.bind(this));
  }

  onError(err: Error) {
    //eslint-disable-next-line no-console
    console.error(err);
  }

  onConnection(ws: WebSocket) {
    //eslint-disable-next-line no-console
    console.log('new client connected');
    ws.on('message', this.onMessage.bind(this, ws));
  }

  onMessage<T extends TMessageType>(ws: WebSocket, msg: RawData) {
    //eslint-disable-next-line no-console
    console.log(`New message: ${JSON.stringify(msg)}`);

    try {
      let data: TMessage<T, 'request'>;
      const parsedMessage = JSON.parse(String(msg));
      const parsedData = JSON.parse(parsedMessage.data);
      data = parsedMessage;
      data.data = parsedData;
      const result = this.router.handler(data.type, data);
      if (result) {
        const responseData = JSON.stringify(result.data);
        result.data = responseData;
        const response = JSON.stringify(result);
        ws.send(response);
      }
    } catch (err) {
      //eslint-disable-next-line no-console
      console.error(err);
    }
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
