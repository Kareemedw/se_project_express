class Created extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 201;
  }
}
class RequestStatusOk extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
}
class RequestCompleted extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204;
  }
}

module.exports = {
  Created,
  RequestStatusOk,
  RequestCompleted,
};
