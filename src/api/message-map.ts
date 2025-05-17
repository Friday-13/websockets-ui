export interface IMessageMap {
  reg: {
    request: IRegRequest;
    response: IRegResponse;
  };
  update_winners: {
    request: null;
    response: {
      name: string;
      wins: number;
    }[];
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

export type TMessageType = keyof IMessageMap;

export type TMessage<
  T extends TMessageType = TMessageType,
  D extends keyof IMessageMap[T] = keyof IMessageMap[T],
> = {
  type: T;
  data: IMessageMap[T][D];
  id: number;
};
