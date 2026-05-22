# @haensl/iso-log

A tiny isomorphic logging facade for JavaScript applications.

[![NPM](https://nodei.co/npm/@haensl%2Fiso-log.png?downloads=true)](https://nodei.co/npm/@haensl%2Fiso-log/)
[![npm version](https://badge.fury.io/js/@haensl%2Fiso-log.svg)](http://badge.fury.io/js/@haensl%2Fiso-log)
[![CircleCI](https://circleci.com/gh/haensl/iso-log.svg?style=svg)](https://circleci.com/gh/haensl/iso-log)


`@haensl/iso-log` provides a single logging API that works in browsers, Node.js, and frameworks such as Next.js without introducing runtime dependencies on server-only modules.

The logger starts in a buffering mode and can be initialized later once the host application knows which logger and error reporting implementation it wants to use.

## Features

- Isomorphic (Browser + Node.js)
- No hard dependency on Bunyan, Sentry, or any other logging backend
- Buffers log messages before initialization
- Optional error reporting integration
- Tiny API surface
- ESM-first

## Installation

```bash
npm install @haensl/iso-log
```

## Quick Start

```js
import log from '@haensl/iso-log';

log.info('Application starting...');

log.init();

log.info('Application started.');
```

## Initialization

The logger can be initialized with:

- a custom logger implementation
- an error reporting callback

```js
import log from '@haensl/iso-log';

log.init({
  logger: console,
  onError: (error) => {
    console.error('Reporting error:', error);
  }
});
```

### Configuration

| Option | Type | Required | Description |
|----------|----------|----------|----------|
| `logger` | Object | No | Logger implementation to use |
| `onError` | Function | No | Called for every `Error` passed to `warn()` or `error()` |

## Logger Interface

A custom logger should implement any subset of:

```js
{
  debug(...args) {},
  info(...args) {},
  warn(...args) {},
  error(...args) {}
}
```

Methods are optional.

Example:

```js
log.init({
  logger: {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
  }
});
```

## Error Reporting

Errors passed to `warn()` and `error()` can be forwarded to an external service.

```js
log.init({
  onError: (error) => {
    sentry.captureException(error);
  }
});
```

Example:

```js
log.error(new Error('Something exploded'));
```

The supplied callback receives:

```js
Error
```

instances only.

Non-error arguments are ignored.

```js
log.error(
  'Something exploded',
  new Error('Boom')
);
```

Only the `Error` object is reported.

## Buffering

Calls made before initialization are buffered.

```js
log.info('A');
log.info('B');
log.info('C');

log.init({
  logger: console
});
```

The buffered messages are flushed in FIFO order:

```text
A
B
C
```

This makes it safe to log during application startup before logging infrastructure has been configured.

## API

### `log.init(options?)`

Initialize the logger.

```js
log.init({
  logger,
  onError
});
```

### `log.debug(...args)`

Write a debug message.

```js
log.debug('Loading user', userId);
```

### `log.info(...args)`

Write an informational message.

```js
log.info('Server started');
```

### `log.warn(...args)`

Write a warning.

Errors are forwarded to `onError`.

```js
log.warn(
  'Unexpected response',
  new Error('Invalid payload')
);
```

### `log.error(...args)`

Write an error.

Errors are forwarded to `onError`.

```js
log.error(
  'Request failed',
  new Error('Connection refused')
);
```

## Bunyan Example

```js
import bunyan from 'bunyan';
import log from '@haensl/iso-log';

log.init({
  logger: bunyan.createLogger({
    name: 'api'
  })
});
```

## Sentry Example

```js
import * as Sentry from '@sentry/node';
import log from '@haensl/iso-log';

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

log.init({
  logger: console,
  onError: Sentry.captureException
});
```

## Next.js Example

Client:

```js
import * as Sentry from '@sentry/nextjs';
import log from '@haensl/iso-log';

log.init({
  onError: Sentry.captureException
});
```

Server:

```js
import bunyan from 'bunyan';
import * as Sentry from '@sentry/nextjs';
import log from '@haensl/iso-log';

log.init({
  logger: bunyan.createLogger({
    name: 'web'
  }),
  onError: Sentry.captureException
});
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
