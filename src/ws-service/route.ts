//TODO: replace unkdnown data to proper type
type TRouteHandlerCore = (data: unknown) => unknown;
interface IRouteParams {
  name: string;
  handlerCore: TRouteHandlerCore;
}
export default class Route {
  name: string;
  handlerCore: TRouteHandlerCore;

  constructor({ name, handlerCore }: IRouteParams) {
    this.name = name;
    this.handlerCore = handlerCore;
  }

  handler(data: unknown) {
    //TODO: Add wrapper
    return this.handlerCore(data)
  }
}
