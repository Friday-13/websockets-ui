export interface IPlayerMessageMap {
  reg: {
    request: IRegRequest;
    response: IRegResponse;
  };
  update_winners: {
    request: null;
    response: IWinnerResponse[];
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

interface IWinnerResponse {
  name: string;
  wins: number;
}
