import { RawData, WebSocket, WebSocketServer } from 'ws';
import getDb from '../db/get-db';
import { TMessage, TMessageType } from '../api/message-map';
import Router from './router';
import { regRoute } from '../api/registration';
import { ConnectionModel } from '../db/connection-repository';
import { createRoomRoute } from '../api/create-room';
import { addUserToRoomRoute } from '../api/add-user-to-room';
import { addShipsRoute } from '../api/add-ships';
import { attackRoute } from '../api/attack';

const router = new Router();
router.addRoute(regRoute);
router.addRoute(createRoomRoute);
router.addRoute(addUserToRoomRoute);
router.addRoute(addShipsRoute);
router.addRoute(attackRoute);

const wsMessageHandler = <T extends TMessageType>(
  ws: WebSocket,
  msg: RawData
) => {
  try {
    let data: TMessage<T, 'request'>;
    const parsedMessage = JSON.parse(String(msg));
    const parsedData =
      parsedMessage.data === '' ? '' : JSON.parse(parsedMessage.data);
    // const parsedData = JSON.parse(messageData);
    data = parsedMessage;
    data.data = parsedData;
    router.handler(ws, data.type, data);
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(err);
  }
};

const wsConnectionClosed = (connection: ConnectionModel) => {
  const db = getDb();
  db.connections.delete(connection.id);
};

const addConnection = (ws: WebSocket) => {
  const db = getDb();
  const connection = db.connections.create({ ws });

  ws.on('message', (data) => wsMessageHandler(ws, data));
  ws.on('close', () => wsConnectionClosed(connection));
};

let wss: WebSocketServer;
const createWSServer = (port: number) => {
  if (!wss) {
    wss = new WebSocketServer({ port });
    wss.on('connection', addConnection);
  }
};

const sendToMany = (message: string, clients: Set<WebSocket>) => {
  clients.forEach((ws) => {
    ws.send(message);
  });
};

const sendToAll = (message: string) => {
  sendToMany(message, wss.clients);
};

const sendPersonal = (message: string, client: WebSocket) => {
  sendToMany(message, new Set([client]));
};

export { wss, createWSServer, sendToMany, sendToAll, sendPersonal };
