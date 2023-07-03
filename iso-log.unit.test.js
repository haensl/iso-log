const environments = require('@haensl/environments');
const { name } = require('./package');

describe('iso-log', () => {
  let log;
  let haenslLog;
  let bunyan;
  let reset;

  beforeAll(() => {
    reset = () => {
      jest.resetModules();
      haenslLog = require('@haensl/log');
      log = require('./');
      bunyan = require('bunyan');
      jest.spyOn(haenslLog, 'debug')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(bunyan.prototype, 'debug')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(haenslLog, 'error')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(bunyan.prototype, 'error')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(haenslLog, 'info')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(bunyan.prototype, 'info')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(haenslLog, 'warn')
        .mockImplementation(() => {
          // suppress console output
        });
      jest.spyOn(bunyan.prototype, 'warn')
        .mockImplementation(() => {
          // suppress console output
        });
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('debug()', () => {
    describe('without initialization', () => {
      beforeEach(() => {
        reset();
      });

      it('buffers the call', () => {
        expect(log.debug.bind(null, 'log:debug()'))
          .not
          .toThrow();

        expect(haenslLog.debug)
          .not
          .toHaveBeenCalled();

        log.init({
          environment: environments.development,
          name
        });

        expect(haenslLog.debug)
          .toHaveBeenCalledWith('log:debug()');
      });
    });

    describe('with initialization', () => {
      beforeAll(() => {
        reset();
      });

      describe('development environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.development,
            name
          });

          log.debug('log.debug()');
        });

        it('logs via haensl/log', () => {
          expect(haenslLog.debug)
            .toHaveBeenCalledWith('log.debug()');
        });
      });

      describe('qa environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.qa,
            name
          });

          log.debug('log.debug()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.debug)
            .toHaveBeenCalledWith('log.debug()');
        });
      });

      describe('production environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.production,
            name
          });

          log.debug('debug log');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.debug)
            .toHaveBeenCalledWith('log.debug()');
        });
      });
    });
  });

  describe('error()', () => {
    describe('without initialization', () => {
      beforeEach(() => {
        reset();
      });

      it('buffers the call', () => {
        expect(log.error.bind(null, 'log.error()', { test: true }))
          .not
          .toThrow();

        expect(haenslLog.error)
          .not
          .toHaveBeenCalled();

        log.init({
          environment: environments.development,
          name
        });

        expect(haenslLog.error)
          .toHaveBeenCalledWith('log.error()', { test: true });
      });
    });

    describe('with initialization', () => {
      beforeAll(() => {
        reset();
      });

      describe('development environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.development,
            name
          });

          log.error('log.error()');
        });

        it('logs via haensl/log', () => {
          expect(haenslLog.error)
            .toHaveBeenCalledWith('log.error()');
        });
      });

      describe('qa environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.qa,
            name
          });

          log.error('log.error()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.error)
            .toHaveBeenCalledWith('log.error()');
        });
      });

      describe('production environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.production,
            name
          });

          log.error('log.error()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.error)
            .toHaveBeenCalledWith('log.error()');
        });
      });
    });
  });

  describe('info()', () => {
    describe('without initialization', () => {
      beforeEach(() => {
        reset();
      });

      it('buffers the call', () => {
        expect(log.info.bind(null, 'log.info()'))
          .not
          .toThrow();

        expect(haenslLog.info)
          .not
          .toHaveBeenCalled();

        log.init({
          environment: environments.development,
          name
        });

        expect(haenslLog.info)
          .toHaveBeenCalledWith('log.info()');
      });
    });

    describe('with initialization', () => {
      beforeAll(() => {
        reset();
      });

      describe('development environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.development,
            name
          });

          log.info('log.info()');
        });

        it('logs via haensl/log', () => {
          expect(haenslLog.info)
            .toHaveBeenCalledWith('log.info()');
        });
      });

      describe('qa environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.qa,
            name
          });

          log.info('log.info()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.info)
            .toHaveBeenCalledWith('log.info()');
        });
      });

      describe('production environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.production,
            name
          });

          log.info('log.info()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.info)
            .toHaveBeenCalledWith('log.info()');
        });
      });
    });
  });

  describe('log()', () => {
    describe('without initialization', () => {
      beforeEach(() => {
        reset();
      });

      it('buffers the call', () => {
        expect(log.log.bind(null, 'log.log()'))
          .not
          .toThrow();

        expect(haenslLog.info)
          .not
          .toHaveBeenCalled();

        log.init({
          environment: environments.development,
          name
        });

        expect(haenslLog.info)
          .toHaveBeenCalledWith('log.log()');
      });
    });

    describe('with initialization', () => {
      beforeAll(() => {
        reset();
      });

      describe('development environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.development,
            name
          });

          log.log('log.log()');
        });

        it('logs via haensl/log', () => {
          // expect info to be called because it's an alias
          expect(haenslLog.info)
            .toHaveBeenCalledWith('log.log()');
        });
      });

      describe('qa environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.qa,
            name
          });

          log.log('log.log()');
        });

        it('logs via bunyan', () => {
          // expect info to be called because it's an alias
          expect(bunyan.prototype.info)
            .toHaveBeenCalledWith('log.log()');
        });
      });

      describe('production environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.production,
            name
          });

          log.log('log.log()');
        });

        it('logs via bunyan', () => {
          // expect info to be called because it's an alias
          expect(bunyan.prototype.info)
            .toHaveBeenCalledWith('log.log()');
        });
      });
    });
  });

  describe('warn()', () => {
    describe('without initialization', () => {
      beforeEach(() => {
        reset();
      });

      it('buffers the call', () => {
        expect(log.warn.bind(null, 'log.warn()'))
          .not
          .toThrow();

        expect(haenslLog.warn)
          .not
          .toHaveBeenCalled();

        log.init({
          environment: environments.development,
          name
        });

        expect(haenslLog.warn)
          .toHaveBeenCalledWith('log.warn()');
      });
    });

    describe('with initialization', () => {
      beforeAll(() => {
        reset();
      });

      describe('development environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.development,
            name
          });

          log.warn('log.warn()');
        });

        it('logs via haensl/log', () => {
          expect(haenslLog.warn)
            .toHaveBeenCalledWith('log.warn()');
        });
      });

      describe('qa environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.qa,
            name
          });

          log.warn('log.warn()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.warn)
            .toHaveBeenCalledWith('log.warn()');
        });
      });

      describe('production environment', () => {
        beforeEach(() => {
          log.init({
            environment: environments.production,
            name
          });

          log.warn('log.warn()');
        });

        it('logs via bunyan', () => {
          expect(bunyan.prototype.warn)
            .toHaveBeenCalledWith('log.warn()');
        });
      });
    });
  });
});
