export default class InputValidationError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.code = 'IVErr';
  }
}
