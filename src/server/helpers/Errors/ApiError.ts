export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  /**
   *
   */
  constructor(statusCode: number, message: string) {
    super(message);

    this.message = message;
    this.statusCode = statusCode
  }
}