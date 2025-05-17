import { httpServer } from './http_server/index';
import App from './app';
const HTTP_PORT = 8181;

//eslint-disable-next-line no-console
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
const app = new App();
app.start();
