module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: [
          'src/intro.js',
          'src/intro.class.js',
          'src/core.js',
          'src/outro.class.js',
          'src/outro.export.js',
          'src/outro.js'
        ],
        dest: 'dist/<%= pkg.title %>.js'
      }
    },
    jscs: {
      main: {
        src: 'dist/<%= pkg.title %>.js',
        options: {
          config: '.jscs.json',
          fix: true,
          force: true
        }
      }
    },
    jshint: {
      all: {
        src: [
          'Gruntfile.js', 'dist/<%= pkg.title %>.js'
        ],
        options: {
          jshintrc: true
        }
      },
      dist: {
        src: 'dist/<%= pkg.title %>.js',
        options: {
          jshintrc: true
        }
      }
    },
    jsbeautifier: {
      rewrite: {
        src: 'dist/<%= pkg.title %>.js'
      },
      options: {
        js: {
          indentSize: 2,
          jslintHappy: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.title %>.js',
        dest: 'dist/<%= pkg.title %>.min.js'
      }
    },
    jasmine: {
      acceptance: {
        src: 'dist/<%= pkg.title %>.js',
        options: {
          specs: ['test/acceptance/*.js'],
          vendor: [
            'vendor/jquery/jquery.js',
            'vendor/jquery/jasmine-jquery.js'
          ],
          outfile: 'test/acceptance/SpecRunner.html',
          keepRunner: true,
          '--web-security': 'no'
        }
      },
      unit: {
        src: ['src/core.js'],
        options: {
          specs: ['test/unit/*.js'],
          outfile: 'test/unit/SpecRunner.html',
          keepRunner: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default',
      ['concat', 'jshint', 'jscs', 'jsbeautifier', 'uglify', 'jasmine:acceptance', 'jasmine:unit']
  );

  grunt.registerTask('unit',
      ['concat', 'jshint', 'jscs', 'jsbeautifier', 'jasmine:unit']
  );

};
