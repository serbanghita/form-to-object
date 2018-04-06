module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['spec'],
        browsers: ['Chrome'],
        autoWatch: false,
        singleRun: true,
        debug: false,
        files: [
            'lib/core.js',
            'test/unit/*.js'
        ]
    });
};
