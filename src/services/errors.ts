export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials.", 401);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User with same email already exists.", 409);
  }
}

export class EmailAlreadyUsedError extends UserAlreadyExistsError {}

export class ConflictError extends AppError {
  constructor(message = "Conflict.") {
    super(message, 409);
  }
}

export class ActionNotAllowedError extends AppError {
  constructor(message = "Action not allowed.") {
    super(message, 403);
  }
}

export class ForbiddenError extends ActionNotAllowedError {}

export class CarInactiveError extends AppError {
  constructor() {
    super("Car is inactive.", 400);
  }
}

export class DuplicateEvaluationError extends ConflictError {
  constructor() {
    super("User has already evaluated this car.");
  }
}
