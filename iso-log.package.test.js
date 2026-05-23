describe('@haensl/iso-log', () => {
  let log;

  beforeEach(async () => {
    jest.resetModules();
    const m = await import('@haensl/iso-log');
    log = m.default;
  });

  describe('import via full uri', () => {
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
    it('exposes an init function', async () => {
      const m = await import('@haensl/iso-log');
      const { init }  = m.default;
      expect(typeof init)
        .toEqual('function');
    });
  });
});
