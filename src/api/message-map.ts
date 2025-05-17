export interface IMessageMap {
  reg: {
    request: IRegRequest;
    response: IRegResponse;
  };
  update_winners: {
    request: null;
    response: IWinner[];
  };
}

interface IRegRequest {
  name: string;
  password: string;
}

interface IRegResponse {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

interface IWinner {
  name: string;
  wins: number;
}

export type TMessageType = keyof IMessageMap;

export type TMessage<
  T extends TMessageType = TMessageType,
  D extends keyof IMessageMap[T] = keyof IMessageMap[T],
> = {
  type: T;
  data: IMessageMap[T][D];
  id: number;
};
