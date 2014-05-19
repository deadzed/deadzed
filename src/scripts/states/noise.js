
function NoiseTest(game) {
    this.gen = new Noise(Math.random());
}

NoiseTest.prototype = {
    create: function() {
        var width = 50;
        var height = 50;
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'test');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.tilemap = this.game.add.tilemap();
        this.tilemap.addTilesetImage('ground', 'tileset', 10, 10);
        this.ground_layer = this.tilemap.create('ground', width, height, 10, 10);
        this.ground_layer.resizeWorld();
        for(var x=0; x<width; x++) {
            for(var y=0; y<height; y++) {
                tile = Math.floor(Math.random()*4);
                this.tilemap.putTile(tile, x, y, this.ground_layer);
            }
        }

        this.sprite.bringToTop();
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (this.cursors.left.isDown) {
            this.game.camera.x -= 4;
        }
        else if (this.cursors.right.isDown) {
            this.game.camera.x += 4;
        }

        if (this.cursors.up.isDown) {
            this.game.camera.y -= 4;
        }
        else if (this.cursors.down.isDown) {
            this.game.camera.y += 4;
        }
    }
};

module.exports = NoiseTest;
