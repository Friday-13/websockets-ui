//TODO: replace unkdnown data to proper type
type TRouteHandlerCore = (data: unknown) => unknown;
interface IRouteParams {
  name: string;
  handler: TRouteHandlerCore;
}
export default class Route {
  name: string;
  handler: TRouteHandlerCore;

  constructor({ name, handler }: IRouteParams) {
    this.name = name;
    this.handler = handler;
  }
}
