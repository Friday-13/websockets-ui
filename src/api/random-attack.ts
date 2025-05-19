import IPosition from '../types/iposition';
import getRandomNumber from '../utils/get-random-number';
import Route, { TRouteHandlerCore } from '../ws-service/route';
import { attackHandler } from './attack';
import { TMessage } from './message-map';

const generateRandomPosition = (): IPosition => {
  return { x: getRandomNumber(9), y: getRandomNumber(9) };
};

const randomAttackHandler: TRouteHandlerCore<'randomAttack'> = ({
  db,
  ws,
  data,
}) => {
  const position = generateRandomPosition();
  const attackRequest: TMessage<'attack', 'request'> = {
    type: 'attack',
    id: 0,
    data: {
      x: position.x,
      y: position.y,
      indexPlayer: data.data.indexPlayer,
      gameId: data.data.gameId,
    },
  };
  attackHandler({ db, data: attackRequest, ws });
};
export const randoAttackRoute = new Route({
  name: 'randomAttack',
  handlerCore: randomAttackHandler,
});
