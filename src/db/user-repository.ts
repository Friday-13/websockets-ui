import IBaseModel from './ibase-model';
import RepositoryBase from './repository-base';
import DbError from '../errors/db-error';
import getNewUserId from './get-new-user-id';

export interface IUserData {
  name: string;
  password: string;
  wins?: number;
}

export interface IUser extends IUserData {
  id: string | number;
  wins: number;
}

export class UserModel implements IBaseModel {
  id: string | number;
  name: string;
  password: string;
  wins: number;

  constructor({ name, password, wins = 0 }: IUserData) {
    this.id = getNewUserId();
    this.name = name;
    this.password = password;
    this.wins = wins;
  }
}

export class UserRepository extends RepositoryBase<UserModel> {
  create(userData: IUserData) {
    if (userData.wins === undefined) {
      this.validateUser({ ...userData, wins: 0 });
    } else {
      this.validateUser(userData);
    }
    const user = new UserModel(userData);
    this.records.push(user);
    return user;
  }

  update(userData: Partial<IUser>) {
    this.validateUserWithId(userData);
    const user = this.getById(userData.id);
    if (!user)
      throw new DbError(
        'recErr',
        `User with ID ${userData.id} does not exist.`
      );
    user.name = userData.name;
    user.password = userData.password;
    user.wins = userData.wins;
    return user;
  }

  getByName(name: string) {
    return this.records.find((record) => record.name === name) || null;
  }

  validateUsername(username?: string): asserts username is string {
    if (username === undefined)
      throw new DbError('inputErr', 'Username must be defined');
    if (username.length < 5)
      throw new DbError(
        'inputErr',
        'Username must be longer than 5 characters'
      );
  }

  validatePassword(password?: string): asserts password is string {
    if (password === undefined)
      throw new DbError('inputErr', 'Password must be defined');
    if (password.length < 5)
      throw new DbError(
        'inputErr',
        'Password must be longer than 5 characters'
      );
  }

  validateWins(wins?: number): asserts wins is number {
    if (wins === undefined)
      throw new DbError('inputErr', 'Wins must be defined');
    if (wins < 0)
      throw new DbError('inputErr', 'Wins must be a positive number');
  }

  validateUser(user: Partial<IUserData>): asserts user is IUserData {
    this.validateUsername(user.name);
    this.validatePassword(user.password);
    this.validateWins(user.wins);
  }

  validateUserWithId(user: Partial<IUser>): asserts user is IUser {
    this.validateUser(user);
  }
}
