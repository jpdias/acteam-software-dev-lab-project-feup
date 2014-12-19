module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      options: {
        background: true,
        fallback: function() {},
        port: 80,
      },
      dev: {
        options: {
          script: 'app.js',

        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: true
        },
        src: ['test/unitTests.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-heroku-deploy');
  grunt.registerTask('default', ['express:dev', 'mochaTest']);
};