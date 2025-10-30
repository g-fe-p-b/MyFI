class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class ConflictError extends ApiError {
    constructor(message = "Conflict occurred") {
        super(message, 409);
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export { ApiError, NotFoundError, ConflictError, BadRequestError, ForbiddenError, UnauthorizedError };