class Response {
  constructor(isError, data, message) {
    this.isError = isError;
    this.data = data;
    this.message = message;
  }
}

module.exports = Response;
