module.exports = function(config) {
    config.set({
        frameworks: ['jasmine-jquery', 'jasmine'],
        reporters: ['spec'],
        browsers: ['Chrome_custom'], //['PhantomJS_custom'],
        // you can define custom flags
        // http://karma-runner.github.io/1.0/config/browsers.html
        customLaunchers: {
            'Chrome_custom': {
                base: 'Chrome',
                flags: ['--allow-file-access-from-files', '--no-default-browser-check']
            }
        },
        autoWatch: false,
        singleRun: true,
        debug: false,

        files: [
            'dist/formToObject.js',
            'test/acceptance/*.js',
            { pattern: 'test/acceptance/fixtures/*.html', included: false, served: true }
        ],
        browserConsoleLogOptions: {level: 'debug', format: '%b %T: %m', terminal: true}
    });
};
