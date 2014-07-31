// karma.conf.js
module.exports = function(config) {

  'use strict';

  config.set({
    preprocessors: {
      '**/*.html': ['html2js']
    },

    files: [
      'fixtures/*.html'
    ]
  });
};