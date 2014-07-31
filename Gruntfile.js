module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
        options: {
          jshintrc: true
        },
        core: {
          src: 'src/<%= pkg.name %>.js'
        },
        test: {
          src: 'test/*.js'
        },
        grunt: {
          src: 'Gruntfile.js'
        }
      },
      karma: {
        continuous: {
            configFile: 'test/karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS']
          },
        },
        jasmine: {
          src: 'src/*.js',
          options: {
            specs: ['test/test.js'],
            outfile: 'test/SpecRunner.html',
            keepRunner: true
          }
        }
      });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

};