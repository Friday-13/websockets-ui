import { WebSocketServer } from 'ws';

const displayWsStartedParamaters = (wss: WebSocketServer) => {
  //eslint-disable-next-line no-console
  console.log('[WebSocket Server Started]');
  //eslint-disable-next-line no-console
  console.log(`
  ⚙️Server URL: ws://localhost:${wss.options.port}  
  ⚙️Port: ${wss.options.port}  
  ⚙️Protocol: ws  
  ⚙️Status: Listening`);
};

//eslint-disable-next-line no-console
const logWsErrors = (err: Error) => console.error(err);

const wss = new WebSocketServer({ port: 3000 });
wss.on('connection', function connection(ws) {
  displayWsStartedParamaters(wss);
  ws.on('error', logWsErrors);

  ws.on('message', (data) => {
    //eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
    const resp = {
      type: 'reg',
      data: JSON.stringify({
        name: 'test-name',
        index: '1',
        error: false,
        errorText: '',
      }),
      id: 0,
    };
    ws.send(JSON.stringify(resp));
  });
});
