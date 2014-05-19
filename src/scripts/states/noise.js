
function NoiseTest(game) {
    this.gen = new Noise(Math.random());
}

NoiseTest.prototype = {
    create: function() {
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'test');
        this.sprite.anchor.setTo(0.5, 0.5);
    }
};

module.exports = NoiseTest;
