# iso-log

Isomorphic JavaScript logger with Bunyan and Sentry support.

[![NPM](https://nodei.co/npm/@haensl%2Fiso-log.png?downloads=true)](https://nodei.co/npm/@haensl%2Fiso-log/)

[![npm version](https://badge.fury.io/js/@haensl%2Fiso-log.svg)](http://badge.fury.io/js/@haensl%2Fiso-log)
[![CircleCI](https://circleci.com/gh/haensl/iso-log.svg?style=svg)](https://circleci.com/gh/haensl/iso-log)

## Installation

### Via `npm`

```bash
$ npm install -S @haensl/iso-log
```

### Via `yarn`

```bash
$ yarn add @haensl/iso-log
```

## Usage

1. [Install @haensl/iso-log](#installation)

2. Use iso-log in your projects:


    ESM, i.e. `import`

    ```javascript
    import log from '@haensl/iso-log';

    // iso-log needs initialization once in your app
    log.init({
      environment: 'production',
      name: 'my log'
    });

    // use it like you use console.log, console.error, ...
    log.info('Log ready for operations');
    ```

    CJS, i.e. `require`

    ```javascript
    const log = require('@haensl/iso-log');

    // iso-log needs initialization once in your app
    log.init({
      environment: 'development',
      name: 'my log'
    });


    // use it like you use console.log, console.error, ...
    log.info('Log ready for operations');
    ```

## Synopsis

iso-log offers the same API `console` does plus an `init()` function:

`debug(...args)`: Log at debug log level.

`error(...args)`: Log at error log level.

`info(...args)`: Log at info log level.

`log(...args)`: Alias for `info`.

`warn(...args)`: Log at warning log level.

`init({ environment, name, sentryConfig })`: Initialize the log. (See [Configuration](#config)).

## Configuration <a name="config"></a>

The log needs to be initialized before first use to work properly. It will buffer calls made before the module was `init()`ialized.


```javascript
const log = require('@haensl/iso-log');
const environments = require('@haensl/environments');

// calls to log.error(), log.info(), log.debug(), etc are buffered until `init()` is called.

log.init({
  environment: environments.qa, // Set the environment your app runs in. String.
  name: 'My log', // Provide a name for the log.
  sentryConfig: { // Provide Sentry configuration.
    dsn: 'your sentry DSN here'
  }
});

// log will process all buffered calls once it is initialized.

// log is now ready for use.
```

## Features

### Report errors and warnings to [Sentry](https://sentry.io)

You can provide a [`sentryConfig`](https://docs.sentry.io/platforms/node/configuration/) object to the initialization call. If you do, all `Error` objects handed to `log.error` and `log.warn` will be forwarded to Sentry.

#### Enriching errors reported to Sentry

You can attach additional information about the error by setting theses props on the `Error` object:

* `user`: Set `error.user` to e.g. a user ID to pin the user for which the error occurred:

    ```javascript
    const log = require('@haensl/iso-log');

    // ...

    try {
      const data = await user.getData();
    } catch (error) {
      // Attach user id to the error.
      error.user = user.id;
      log.error('Failing to retrieve user data', error);
    }
    ```

* `request`: Set `error.request` to provide information about any network request the error pertains to.

    ```javascript
    const log = require('@haensl/iso-log');

    // ...

    try {
      const data = await getData();
    } catch (error) {
      // Attach request information.
      error.request = {
        url: 'https://url.to.data'
      };

      log.error('Failing to retrieve data', error);
    }
    ```

* `response`: Set `error.response` to provide information about any network responses associated with the error.

    ```javascript
    const log = require('@haensl/iso-log');
    const fetch = require('node-fetch');

    // ...

    const response = await fetch(apiRequest);

    if (!response.ok) {
      const error = new Error('API request failing');

      error.response = {
        status: response.status,
        statusText: response.statusText,
        body: typeof response.text === 'function' ? await response.text() : undefined
      }

      log.error(error);
    }
    ```

* `ctx`: Provide additional context to the error by adding props to `error.ctx`.

    ```javascript
    const log = require('@haensl/iso-log');
    const fetch = require('node-fetch');

    try {

    } catch (error) {
      // Provide any additional helpful data in `error.ctx` to give context to the error.
      error.ctx = {
        userInput: 'inputValue',
        foo: 1
      };

      log.error(error);
    }
    ```

* `koa`: If you're using [Koa](https://koajs.com/), iso-log will try to pull context information from `error.koa`.

    ```javascript
    const log = require('@haensl/iso-log');

    // Example error middleware
    const errorMiddleware = () => async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        error.koa = ctx;

        log.error(error);
      }
    };
    ```

## [Changelog](CHANGELOG.md)
