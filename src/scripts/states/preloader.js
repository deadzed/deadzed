'use strict';

var WorldGen = require("../worldgen/client");

function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function() {
        this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);

        this.load.image('test', 'images/test.png');
        this.load.image('tileset', 'images/tileset.png');
    },

    create: function() {
        this.asset.cropEnabled = false;
        WorldGen.init(this.game);
    },

    update: function() {
        if(this.ready) {
            this.game.state.start('noise');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preload;