import IBaseModel from './ibase-model';
import RepositoryBase from './repository-base';
import DbError from '../errors/db-error';
import { WebSocket } from 'ws';
import getNewConnectionId from './get-new-connection-id';

export interface IConnectionData {
  ws: WebSocket;
  userId?: string | number;
}

export interface IConnection extends IConnectionData {
  id: string | number;
}

export class ConnectionModel implements IBaseModel {
  id: number;
  ws: WebSocket;
  userId?: string | number;

  constructor({ ws, userId }: IConnectionData) {
    this.id = getNewConnectionId();
    this.ws = ws;
    this.userId = userId;
  }
}

export class ConnectionRepository extends RepositoryBase<ConnectionModel> {
  create(connectionData: IConnectionData) {
    const connection = new ConnectionModel(connectionData);
    this.records.push(connection);
    return connection;
  }

  update(connectionData: IConnection) {
    const connection = this.getById(connectionData.id);
    if (connection) {
      connection.ws = connectionData.ws;
      connection.userId = connectionData.userId;
    } else {
      throw new DbError('recErr', 'Connection was closed or unexists');
    }
    return connection;
  }

  getByWs(ws: WebSocket) {
    return this.records.find((connection) => connection.ws === ws) || null;
  }

  getByUserId(id: string | number) {
    return this.records.find((connection) => connection.userId === id) || null;
  }
}
