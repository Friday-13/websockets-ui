import IPosition from './iposition';

export default interface IShip {
  position: IPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large';
}
