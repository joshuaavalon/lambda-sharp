export class AppError extends Error {
  public statusCode: number;
  public constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
