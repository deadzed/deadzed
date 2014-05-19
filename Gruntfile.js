module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./src/package.json'),
    nodewebkit: {
      options: {
        version: "0.9.2",
        build_dir: './dist',
        mac: true,
        win: true,
        linux32: true,
        linux64: true
      },
      src: './public/**/*'
    }
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
};
