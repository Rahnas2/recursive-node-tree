import { HttpStatus } from "../../interfaces/enums/HttpStatus";

export class ApplicationError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = "Validation failed") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
