(function() {
  'use strict';

  require.config({
    baseUrl: '.',
    paths: {
      mocha: '../lib/mocha/mocha',
      chai: '../lib/mocha/chai',
    },
    shim: {
      mocha: {
        init: function() {
          this.mocha.setup('bdd');
          return this.mocha;
        }
      }
    }
  });

  require(['mocha', 'tests/mockComponent', 'tests/all'], (mocha) => {
    mocha.run();
  });
})();
