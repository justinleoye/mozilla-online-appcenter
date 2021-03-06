// Generated on 2015-10-15 using generator-firefox-extension 0.3.1

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    config.name = grunt.file.readJSON(config.app + '/package.json').name;


    grunt.initConfig({
        config: config,

        shell: {
            run: {
                //command: 'cfx run --pkgdir=<%= config.app %>'
                command: [
                    'cd <%= config.app %>/',
                    'jpm run -b nightly'
                ].join('&&')
            },
            xpi: {
                command: [
                    //'cfx xpi --pkgdir=<%= config.app %>',
                    'cd <%= config.app %>',
                    'jpm xpi',
                    'cd ..',
                    'mv <%= config.name %>.xpi <%= config.dist %>',
                    'wget --post-file=<%= config.dist %>/<%= config.name %>.xpi http://localhost:8888/ || echo>/dev/null'
                ].join('&&')
            },
            build: {
                command: [
                    //'cfx xpi --pkgdir=<%= config.app %>',
                    'cd <%= config.app %>',
                    'jpm xpi',
                    'cd ..',
                    'mv <%= config.app %>/<%= config.name %>*.xpi <%= config.dist %>'
                ].join('&&')
            }
        },
        watch: {
            xpi: {
                files: ['<%= config.app %>/**/*'],
                tasks: ['shell:xpi']
            }
        },
        less: {
          dev: {
            files: [{
                expand: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.app %>',
                src: '{,data/}*.less',
                ext: '.css'
            }]
          }
        },
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'app/data/{,*}/*.html'
                ],
                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        }
    });

    grunt.registerTask('run', ['less:dev', 'shell:run']);
    grunt.registerTask('build', ['less:dev', 'shell:build']);
    grunt.registerTask('default', ['less:dev', 'run']);
};
