var WorldGen = require('../worldgen/client');

function NoiseTest(game) {

}

NoiseTest.prototype = {
    create: function() {
        var width = 500;
        var height = 500;
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'test');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.bringToTop();
        this.cursors = this.game.input.keyboard.createCursorKeys();
        var d = WorldGen.makeMap('ground', width, height, 'tilemap', 10, 10, 7);
        d.setCallback(function(tilemap) {
            //this.game.add.existing(tilemap);
        }, this);

        $('#reset').click(function(){
            WorldGen.makeMap('ground', width, height, 'tilemap', 10, 10, 7);
        });
    },

    update: function() {
        if (this.cursors.left.justPressed()) {
            this.cursors.left.reset();
            this.game.camera.x -= 10;
        }
        else if (this.cursors.right.justPressed()) {
            this.cursors.right.reset();
            this.game.camera.x += 10;
        }

        if (this.cursors.up.justPressed()) {
            this.cursors.up.reset();
            this.game.camera.y -= 10;
        }
        else if (this.cursors.down.justPressed()) {
            this.cursors.down.reset();
            this.game.camera.y += 10;
        }
    }
};

module.exports = NoiseTest;
