module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            dist: {
                cwd: 'src',
                src: ['audio/*', 'font/*'],
                dest: 'dist',
                expand: true
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    // If this is false, SVG elements break.
                    keepClosingSlash: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/js/*.js']
        },

        less: {
            dist: {
                options: {
                    cleancss: true
                },
                files: {
                    'dist/css/main.min.css': 'src/less/main.less'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/js/main.min.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/underscore/underscore.js',
                        'bower_components/backbone/backbone.js',
                        'bower_components/backbone.localstorage/backbone.localStorage.js',
                        'src/js/*.js'
                    ]
                }
            }
        },

        watch: {
            css: {
                files: ['src/less/*.less'],
                tasks: ['less']
            },
            html: {
                files: ['src/*.html'],
                tasks: ['htmlmin']
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'copy', 'htmlmin', 'less', 'uglify']);

};
