// TODO add license
// TODO add versioning
// TODO copy HTML and other static content as needed
// TODO need to produce debug versions of output
// TODO how to create our own bower repos
// TODO figure out how to work with less/stylus/etc.

'use strict';

var path = require("path");


/* Project builds are expected to be performed from a top-level directory referred to 
 * in this file as the build_root. The git repos of all products associated with this 
 * build should be the immediate children of the build_root directory. 
 * 
 * Product repos will typically have the following structure
 *    -- /main - contains the Eclipse projects with the source code for the product's 
 *          components
 *    -- /releng - projects with various release engineering artifacts
 *    -- /tests - projects containing unit tests 
 */
module.exports = function (grunt) {

   // staging area for joining files, downloaded third-party tools, etc.'
   // <repo>/main/<web-project>/web
   var repoPath = "sda.site.web";
   var proj = "edu.tamu.tcat.sda.site.web";
   var rootPath = '..';
   var srcPath = repoPath + "/main/" + proj + "/web";
   
   /*
   *
   var project: {
   
   }
   
   /* Path variables to build outputs
    *   -- relengProjPath - The project used for release engineering. This should be configured 
    *          to ignore the build artifacts
    *   --        
    */
   var relengProjPath = repoPath + "/releng/edu.tamu.tcat.sda.catalog.admin.web.releng";
   var stagingPath = repoPath + "/build";    // working dir for assembling artifacts
   var distPath = repoPath + "/dist";        // destination for built/deployable artifacts
   var vendorPath = stagingPath + '/vendor';

   var jsBaseUrl = srcPath + "/js";
   var relVendorUrl = path.relative(jsBaseUrl, vendorPath);       // relative URL from js root to vendor

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		/* project object contains variables for consistent use 
		 * throughout the grunt script. */
		project: {
		    app: 'app',
		    assets: '',
			vendor: repoPath + '/build/vendor',
			staging: repoPath + '/build',
			dist: repoPath + '/dist',
		    src: repoPath + '/main/' + proj + '/web',
		    scss: ['<%= project.src %>/styles/main.scss'],
		    js: ['<%= project.src %>/js/*js']
		},
		
		tag: {
		    /* TODO add copyright banner here */
		    banner: '/*  */\n'					
		},
		
		/*
        clean: {
            // options global to all subtasks
            options: {
                force: true         // allow cleaning outside CWD
            },

            build: [stagingPath],
            clean: [distPath, stagingPath, 'bower_components'],
            clobber: [distPath, stagingPath, 'bower_components', 'node_modules']
        },
		*/
		
		sass: {
		    dev: {
		        options: {
				    style: 'expanded',
					banner: '<%= tag.banner %>'
					
			    },
				files: {
				    '<%= project.staging%>/assets/css/main.base.css': '<%= project.scss%>'
				}
		    },
		   
		    dist: {
		        
		    }
		},
		
		autoprefixer: {
		    dev: {
			    src: '<%= project.staging%>/assets/css/main.base.css',
			    dest: '<%= project.staging%>/assets/css/main.css'
			}
		},
		
		copy: {
		    dev: {
			    files: [
				    /* Copy CSS files directly to output directory. This allows static CSS files 
					   to be used directly within the page. Typically, CSS should be writen as
					   SASS files and compiled into a single stylesheet using the sass task. */
					{
					    cwd: '<%= project.src %>/css',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/assets/css/',
						src: ['**/*.css']
					},
					
					/* Copy HTML files to output directory */
				    {
					    cwd: '<%= project.src %>/',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/',
						src: ['**/*.html']
					},
					
					/* Copy font files to the assets directory */
					{
					    cwd: '<%= project.src %>/fonts',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/assets/fonts',
						src: ['**/*']
					},
					
					{
					    cwd: '<%= project.src %>/img',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/assets/img',
						src: ['**/*']
					}, 
					
					{
					    cwd: '<%= project.src %>/icons',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/',
						src: ['**/*']
					}, 
					
					{
					    cwd: '<%= project.src %>/vendor',
						expand: true,
						flatten: false,
						dest: '<%= project.staging%>/assets/js/vendor',
						src: ['**/*']
					}
				]
			},
			
			dist: {
			}
		},
		
		/* FIXME use requirejs build process. */
		concat: {
		    options: {
			    sourceMap: true
			},
		    jsdev: {
			    nonull: true,
				src: ['<%= project.src %>/scripts/plugins.js', '<%= project.src %>/scripts/main.js'],
				dest: '<%= project.staging%>/assets/js/main.js',
			}
		}
		
		
       
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-concat');

	/*
    grunt.registerTask('prod', ['bower:install', 'requirejs:build', 'stylus:build', 'uglify:build', 'cssmin:build', 'copy:build', 'clean:build']);
    grunt.registerTask('dev', ['stylus:dev', 'copy:dev']);
	*/
	
	grunt.registerTask('dev', ['sass:dev', 'autoprefixer:dev', 'copy:dev', 'concat:jsdev']);
    grunt.registerTask('default', ['dev']);
};
