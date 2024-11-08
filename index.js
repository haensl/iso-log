const consoleLog = require('@haensl/log');
const environments = require('@haensl/environments');
const { platform } = require('@haensl/services');

let _log;
let _sentry;
const buffer = [];

const debug = (...args) => {
  if (!_log) {
    buffer.push({
      method: 'debug',
      args: args
    });
    return;
  }

  _log.debug(...args);
};

const error = (...args) => {
  if (!_log) {
    buffer.push({
      method: 'error',
      args: args
    });
    return;
  }

  const errors = args
    .filter((arg) => arg instanceof Error);

  if (errors.length && _sentry) {
    errors.forEach((err) => {
      if (typeof _sentry.withScope === 'function') {
        _sentry.withScope((scope) => {
          if (err.user) {
            scope.setUser(err.user);
          }

          if (err.request) {
            scope.setContext('request', err.request);
          }

          if (err.response) {
            scope.setContext('response', err.response);
          }

          if (err.ctx) {
            scope.setContext('ctx', err.ctx);
          }

          if (err.koa && err.koa.request) {
            scope.addEventProcessor((event) =>
              _sentry.Handlers.parseRequest(event, err.koa.request)
            );
          }

          _sentry.captureException(err);
        });
      } else if (typeof _sentry.captureException === 'function') {
        _sentry.captureException(err);
      }
    });
  }

  _log.error(...args);
};

const info = (...args) => {
  if (!_log) {
    buffer.push({
      method: 'info',
      args: args
    });
    return;
  }

  _log.info(...args);
};

const init = ({
  environment,
  name,
  sentry
}) => {
  if (sentry) {
    if (platform.hasWindow) {
      try {
        _sentry = require('@sentry/node').init({ ...sentry });
      } catch (err) {
        warn(err);
      }
    } else {
      try {
        _sentry = require('@sentry/browser').init({ ...sentry });
      } catch (err) {
        warn(err);
      }
    }
  }

  if (environment === environments.development || platform.hasWindow) {
    _log = consoleLog;
  } else {
    try {
      _log = require('bunyan').createLogger({
        name
      });
    } catch (err) {
      _log = consoleLog;
      warn(err);
    }
  }

  while (buffer.length > 0) {
    const call = buffer.pop();
    switch (call.method) {
      case 'debug':
        ISOLog.debug(...call.args);
        break;
      case 'error':
        ISOLog.error(...call.args);
        break;
      case 'info':
        ISOLog.info(...call.args);
        break;
      case 'warn':
        ISOLog.warn(...call.args);
        break;
      default:
        ISOLog.warn(`Unknown method in buffer: ${call.method}`);
        break;
    }
  }
};

const warn = (...args) => {
  if (!_log) {
    buffer.push({
      method: 'warn',
      args: args
    });
    return;
  }

  const errors = args
    .filter((arg) => arg instanceof Error);

  if (errors.length && _sentry) {
    errors.forEach((err) => {
      if (typeof _sentry.withScope === 'function') {
        _sentry.withScope((scope) => {
          if (err.user) {
            scope.setUser(err.user);
          }

          if (err.request) {
            scope.setContext('request', err.request);
          }

          if (err.response) {
            scope.setContext('response', err.response);
          }

          if (err.ctx) {
            scope.setContext('ctx', err.ctx);
          }

          if (err.koa && err.koa.request) {
            scope.addEventProcessor((event) => _sentry.Handlers.parseRequest(event, err.koa.request));
          }

          _sentry.captureException(err, {
            level: 'warning'
          });
        });
      } else if (typeof _sentry.captureException === 'function') {
        _sentry.captureException(err, {
          level: 'warning'
        });
      }
    });
  }

  _log.warn(...args);
};

const ISOLog = {
  debug,
  error,
  info,
  init,
  log: info,
  warn
};

module.exports = ISOLog;

