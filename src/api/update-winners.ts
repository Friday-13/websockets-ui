import Route from '../ws-service/route';
import { TMessage } from './message-map';

const updateWinnersHandler = (
  req: TMessage<'update_winners', 'request'>
): TMessage<'update_winners', 'response'> => {
  //TODO: get top users
  //TODO: create top users list with wins
  const response: TMessage<'update_winners', 'response'> = {
    type: req.type,
    id: req.id,
    data: [],
  };
  return response;
};
export const updateWinnersRoute = new Route({
  name: 'update_winners',
  handlerCore: updateWinnersHandler,
});
