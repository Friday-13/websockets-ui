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
    response: {
      idGame: string | number;
      idPlayer: string | number;
    };
  };
  update_room: {
    request: null;
    response: IUpdateRoomResponse[];
  };
}

interface IUpdateRoomResponse {
  roomId: number | string;
  roomUsers: IRoomUser[];
}

interface IRoomUser {
  name: string;
  index: number | string;
}
