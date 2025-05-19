export default class AuthError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.code = 'AuthErr';
  }
}
