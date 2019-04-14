class Logger {
  static success(message) {
    // eslint-disable-next-line no-console
    console.log('\x1b[32m%s\x1b[0m', message);
  }

  static err(message) {
    // eslint-disable-next-line no-console
    console.log('\x1b[31m%s\x1b[0m', message);
  }

  static warn(message) {
    // eslint-disable-next-line no-console
    console.log('\x1b[33m%s\x1b[0m', message);
  }

  static msg(message) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

module.exports = new Logger();
