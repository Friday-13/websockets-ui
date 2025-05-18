export interface IRoomMessageMap {
  create_room: {
    request: '';
    response: null;
  };
  add_user_to_room: {
    request: { indexRoom: number | string };
    response: null;
  };
  create_game: {
    request: null;
    response: ICreateGameResponse;
  };
  update_room: {
    request: null;
    response: IUpdateRoomResponse[];
  };
}

export interface IUpdateRoomResponse {
  roomId: number | string;
  roomUsers: IRoomUser[];
}

export interface IRoomUser {
  name: string;
  index: number | string;
}

export interface ICreateGameResponse {
  idGame: string | number;
  idPlayer: string | number;
}
