import { TMessage, TMessageType } from '../api/message-map';

const stringifyResponse = <T extends TMessageType>(
  response: TMessage<T, 'response'>
): string => {
  const stringifiedData = JSON.stringify(response.data);
  const partlyStringified = {
    ...response,
    data: stringifiedData,
  };
  return JSON.stringify(partlyStringified);
};

export { stringifyResponse as default };
