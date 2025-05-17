import { IGameMessageMap } from './game-message-map';
import { IPlayerMessageMap } from './player-message-map';
import { IRoomMessageMap } from './room-message-map';
import { IShipsMessageMap } from './ships-message-map';

export type TMessageMap = IPlayerMessageMap &
  IRoomMessageMap &
  IShipsMessageMap &
  IGameMessageMap;

export type TMessageType = keyof TMessageMap;

export type TMessage<
  T extends TMessageType = TMessageType,
  D extends keyof TMessageMap[T] = keyof TMessageMap[T],
> = {
  type: T;
  data: TMessageMap[T][D];
  id: number;
};
