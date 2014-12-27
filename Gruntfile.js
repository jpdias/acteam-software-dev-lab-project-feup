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
    },
    shell: {
      'heroku': {
        command: [
          'git checkout deploy',
          'git merge master',
          'git push heroku deploy',
          'git checkout master'
        ].join('&&')
      }
    },
    watch: {
      files: ['**/*'],
      tasks: ['express:dev'],
      options: {
        spawn: false
      }
    },
  });
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['express:dev', 'watch']);
  grunt.registerTask('deploy', ['express:dev', 'mochaTest', 'shell:heroku']);
};