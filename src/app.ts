import { createWSServer } from './ws-service/ws-server';

const WS_PORT = 3000;

export default class App {
  start() {
    createWSServer(WS_PORT);
    this.displayWsStartedParamaters();
  }

  stop() {}

  displayWsStartedParamaters() {
    //eslint-disable-next-line no-console
    console.log('[WebSocket Server Started]');
    //eslint-disable-next-line no-console
    console.log(`
  ⚙️Server URL: ws://localhost:${WS_PORT}  
  ⚙️Port: ${WS_PORT}  
  ⚙️Protocol: ws  
  ⚙️Status: Listening`);
  }
}
