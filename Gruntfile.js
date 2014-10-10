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
        all: ['src/<%= pkg.name %>.js'],
        grunt: {
          src: 'Gruntfile.js'
        }
      },
      jasmine: {
        src: 'src/*.js',
        options: {
          specs: [
            'test/testInput.js',
            'test/testTextarea.js',
            'test/testSelect.js',
            'test/testUnexpected.js',
            'test/testExceptions.js',
            'test/testComplexForms.js'
          ],
          vendor: ['vendor/jquery/jquery.js', 'vendor/jquery/jasmine-jquery.js'],
          outfile: 'test/SpecRunner.html',
          keepRunner: true,
          '--web-security': 'no'
        }
      }
    });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

};