function Renderer(game, world, tileSet) {
    this.dirty = false;
    this.game = game;
    this.world = world;
    this.tileSet = tileSet;
    this.width = Math.floor(game.width / tileSet.tileWidth);
    this.height = Math.floor(game.height / tileSet.tileHeight);
    this.halfWidth = Math.floor(this.width / 2);
    this.halfHeight = Math.floor(this.height / 2);
    this.x = this.halfWidth;
    this.y = this.halfHeight;
    this.tileMap = new Phaser.Tilemap(
        game, null,
        tileSet.tileWidth, tileSet.tileHeight,
        this.width, this.height
    );
    this.tileMap.addTilesetImage(
        'terrain', tileSet.name,
        tileSet.tileWidth, tileSet.tileHeight
    );
    this.tileLayer = this.tileMap.create(
        'main',
        this.width, this.height,
        tileSet.tileWidth, tileSet.tileWidth
    );
    this.drawTiles();
}

Renderer.prototype = {
    move: function(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.drawTiles();
    },

    up: function(amount) { this.move(0, -amount || -1); },
    down: function(amount) { this.move(0, amount || 1); },
    left: function(amount) { this.move(-amount || -1, 0); },
    right: function(amount) { this.move(amount || 1, 0); },

    drawTiles: function() {
        for (var x=0; x<this.width; x++) {
            for (var y=0; y<this.height; y++) {
                var ox = this.x - this.halfWidth;
                var oy = this.y - this.halfHeight;
                var data = this.world.at(x + ox, y + oy);
                this.putTile(this.tileMap, data.index, x, y);
            }
        }
        this.tileLayer.dirty = true;
    },

    putTile: function (map, tile, x, y) {

        var layer_idx = map.getLayer(map.currentLayer);
        var layer = map.layers[layer_idx];

        if (x >= 0 && x < layer.width && y >= 0 && y < layer.height) {
            var index;

            if (tile instanceof Phaser.Tile) {
                index = tile.index;

                if (this.hasTile(x, y, layer)) {
                    this.layers[layer].data[y][x].copy(tile);
                } else {
                    this.layers[layer].data[y][x] = new Phaser.Tile(layer, index, x, y, tile.width, tile.height);
                }
            } else {
                index = tile;

                if (map.hasTile(x, y, layer_idx)) {
                    layer.data[y][x].index = index;
                } else {
                    layer.data[y][x] = new Phaser.Tile(layer, index, x, y, map.tileWidth, map.tileHeight);
                }
            }
        }
    }
};

module.exports = Renderer;
