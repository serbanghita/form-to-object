module.exports = function () {
  return {
    files: [
      'src/core.js'
    ],

    tests: [
      'test/unit/*.js'
    ],

      testFramework: 'jasmine'
  };
};