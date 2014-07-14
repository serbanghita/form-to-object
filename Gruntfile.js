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
      }
    });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // @todo Add tests

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify']);

};