module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true,
        debug: false,
        files: [
            'src/core.js',
            'test/unit/*.js'
        ]
    });
};