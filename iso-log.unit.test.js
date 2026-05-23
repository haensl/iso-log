import { jest } from   '@jest/globals';
jest.mock('@haensl/log');

describe('iso-log', () => {
  let log;

  beforeEach(async () => {
    jest.resetModules();
    const m = await import('./index');
    log = m.default;
  });

  test('buffers logs before init and flushes them after init', () => {
    const logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    log.debug('a');
    log.info('b');
    log.warn('c');
    log.error('d');

    expect(logger.debug).not.toHaveBeenCalled();

    log.init({ logger });

    expect(logger.debug).toHaveBeenCalledWith('a');
    expect(logger.info).toHaveBeenCalledWith('b');
    expect(logger.warn).toHaveBeenCalledWith('c');
    expect(logger.error).toHaveBeenCalledWith('d');
  });

  test('calls logger immediately after init', () => {
    const logger = {
      debug: jest.fn()
    };

    log.init({ logger });

    log.debug('hello');

    expect(logger.debug).toHaveBeenCalledWith('hello');
  });

  test('calls onError for Error instances in warn/error', () => {
    const logger = {
      warn: jest.fn(),
      error: jest.fn()
    };

    const onError = jest.fn();

    log.init({
      logger,
      onError
    });

    const err = new Error('boom');

    log.warn('something failed', err);
    log.error('fatal', err);

    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith(err);
  });

  test('does not call onError for non-error values', () => {
    const logger = { error: jest.fn() };
    const onError = jest.fn();

    log.init({
      logger,
      onError
    });

    log.error('just a string', { foo: 'bar' });

    expect(onError).not.toHaveBeenCalled();
  });

  test('flush preserves order (FIFO)', () => {
    const logger = {
      info: jest.fn()
    };

    log.info('1');
    log.info('2');
    log.info('3');

    log.init({ logger });

    expect(logger.info.mock.calls.map((c) => c[0])).toEqual([
      '1',
      '2',
      '3'
    ]);
  });

  test('works without logger (no crash, buffers until init)', () => {
    expect(() => {
      log.debug('a');
      log.init({});
      log.debug('b');
    }).not.toThrow();
  });

  test('init replaces logger', () => {
    const logger1 = { debug: jest.fn() };
    const logger2 = { debug: jest.fn() };

    log.init({ logger: logger1 });
    log.debug('a');

    log.init({ logger: logger2 });
    log.debug('b');

    expect(logger1.debug).toHaveBeenCalledWith('a');
    expect(logger2.debug).toHaveBeenCalledWith('b');
  });

  test('supports partial logger implementations', () => {
    const logger = {
      error: jest.fn()
    };

    log.init({ logger });

    expect(() => {
      log.debug('hello');
      log.info('hello');
      log.warn('hello');
      log.error('hello');
    }).not.toThrow();

    expect(logger.error).toHaveBeenCalledWith('hello');
  });
});
