const consoleLog = require('@haensl/log');

const buffer = [];

let logger;
let onError;

const init = ({
  logger: customLogger = consoleLog,
  onError: errorHandler
} = {}) => {
  logger = customLogger ?? consoleLog;
  onError = errorHandler;

  while (buffer.length) {
    const call = buffer.shift();
    if (typeof logger?.[call.method] === 'function') {
      logger[call.method](...call.args);
    }
  }

  buffer.length = 0;
};

const enqueueOrCall = (method, args) => {
  if (logger) {
    if (typeof logger[method] === 'function') {
      logger[method](...args);
    }
  } else {
    buffer.push({
      method,
      args
    });
  }
};

const reportErrors = (args) => {
  if (!onError) {
    return;
  }

  args
    .filter((arg) => arg instanceof Error)
    .forEach((error) => {
      onError(error);
    });
};

const log = {
  debug: (...args) => enqueueOrCall('debug', args),

  info: (...args) => enqueueOrCall('info', args),

  log: (...args) => enqueueOrCall('info', args),

  warn: (...args) => {
    reportErrors(args);
    enqueueOrCall('warn', args);
  },

  error: (...args) => {
    reportErrors(args);
    enqueueOrCall('error', args);
  },

  init
};

module.exports = log;
