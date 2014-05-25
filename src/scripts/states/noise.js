var Client = require('../client');
var Renderer = require('../renderer');

function NoiseTest() { }

NoiseTest.prototype = {
    create: function() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.renderer = new Renderer(this.game, {
           tileWidth: 10, tileHeight: 10, name: 'tileset'
        });
    },

    update: function() {
        if (this.cursors.left.justPressed()) {
            this.cursors.left.reset();
            this.renderer.left();
        }
        else if (this.cursors.right.justPressed()) {
            this.cursors.right.reset();
            this.renderer.right();
        }

        if (this.cursors.up.justPressed()) {
            this.cursors.up.reset();
            this.renderer.up();
        }
        else if (this.cursors.down.justPressed()) {
            this.cursors.down.reset();
            this.renderer.down();
        }
    }
};

module.exports = NoiseTest;
