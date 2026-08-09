class BadRequestStatusCode extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
class ItemNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  BadRequestStatusCode,
  InternalServerError,
  ItemNotFound,
  Conflict,
  Forbidden,
  UnauthorizedError,
};
