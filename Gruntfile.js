module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                files: {
                    'dist/js/main.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/underscore/underscore.js',
                        'bower_components/backbone/backbone.js',
                        'bower_components/backbone.localstorage/backbone.localStorage.js',
                        'src/js/*.js'
                    ]
                }
            }
        },

        copy: {
            dist: {
                cwd: 'src',
                src: ['index.html', 'audio/*', 'font/*'],
                dest: 'dist',
                expand: true
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/js/main.js']
        },

        less: {
            dist: {
                options: {
                    cleancss: true
                },
                files: {
                    'dist/css/main.css': 'src/less/main.less'
                }
            }
        },

        watch: {
            css: {
                files: ['src/js/*.js', 'src/less/*.less'],
                tasks: ['concat', 'less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'concat', 'less', 'copy']);

};
