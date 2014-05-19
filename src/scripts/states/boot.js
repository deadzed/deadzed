'use strict';

function Boot() { }

Boot.prototype = {
    preload: function() {
        console.log("Booting up...");
        this.load.image('preloader', 'images/preloader.gif');
    },
    create: function() {
        this.game.input.maxPointers = 1;
        this.game.state.start('preloader');
    }
};

module.exports = Boot;
