describe('@haensl/iso-log', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('import via full uri', () => {
    const log = require('@haensl/iso-log');

    it('exposes an error function', () => {
      expect(typeof log.error)
      .toEqual('function');
    });

    it('exposes a warning function', () => {
      expect(typeof log.warn)
        .toEqual('function');
    });

    it('exposes a debug function', () => {
      expect(typeof log.debug)
        .toEqual('function');
    });

    it('exposes a log function', () => {
      expect(typeof log.log)
        .toEqual('function');
    });

    it('exposes a init function', () => {
      expect(typeof log.init)
        .toEqual('function');
    });
  });

  describe('spread import', () => {
    const { init }  = require('@haensl/iso-log');

    it('exposes an init function', () => {
      expect(typeof init)
        .toEqual('function');
    });
  });
});
