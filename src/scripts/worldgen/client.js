region = require("./region");

function Deferred() {
    this.callback = null;
    this.context = null;
}

Deferred.prototype = {
    setCallback: function(cb, ctx) {
        this.callback = cb;
        this.context = ctx;
    },
    fire: function() {
        if (this.callback) {
            this.callback.apply(this.context, arguments);
        }
    }
};

function WorldGen() { }

WorldGen.prototype = {

    init: function(game) {
        this.game = game;
        this.maps = {};
    },

    _callto: (function () {

        var data = {
            nextID: 1,
            listeners: {}
        };

        oParser = new Worker("worker.js");

        oParser.onmessage = function (oEvent) {
            if (data.listeners[oEvent.data.id]) {
                var callback = data.listeners[oEvent.data.id];
                callback.fire(oEvent.data.evaluated);
            }
            delete data.listeners[oEvent.data.id];
        };

        return function () {
            var d = new Deferred();
            data.listeners[data.nextID] = d;
            var args = [];
            for (var i=1; i<arguments.length; i++) {
                args.push(arguments[i]);
            }
            oParser.postMessage({
                "id": data.nextID,
                "message": arguments[0],
                "args": args
            });
            data.nextID += 1;
            return d;
        };
    })(),

    makeMap: function(name, width, height, tilemap, twidth, theight, ntiles) {
        d = new Deferred();
        this._callto("generateMap", width, height, ntiles).setCallback(function(map) {
            var tilemap = new Phaser.Tilemap(this.game, null, twidth, theight, width, height);
            tilemap.addTilesetImage('ground', 'tileset', 10, 10);
            ground_layer = tilemap.create(name, width, height, twidth, theight);
            ground_layer.resizeWorld();
            for(var i=0; i<map.length; i++) {
                var tile = map[i];
                this.putTile(tilemap, tile.tile, tile.x, tile.y);
            }
            tilemap.layers[tilemap.currentLayer].dirty = true;
            tilemap.calculateFaces(tilemap.currentLayer);
            d.fire(tilemap);
        }, this);
        return d;
    },

    putTile: function (map, tile, x, y) {

        var layer_idx = map.getLayer(map.currentLayer);
        var layer = map.layers[layer_idx];

        if (x >= 0 && x < layer.width && y >= 0 && y < layer.height)
        {
            var index;

            if (tile instanceof Phaser.Tile)
            {
                index = tile.index;

                if (this.hasTile(x, y, layer))
                {
                    this.layers[layer].data[y][x].copy(tile);
                }
                else
                {
                    this.layers[layer].data[y][x] = new Phaser.Tile(layer, index, x, y, tile.width, tile.height);
                }
            }
            else
            {
                index = tile;

                if (map.hasTile(x, y, layer_idx))
                {
                    layer.data[y][x].index = index;
                }
                else
                {
                    layer.data[y][x] = new Phaser.Tile(layer, index, x, y, map.tileWidth, map.tileHeight);
                }
            }

        }
    }



};

module.exports = new WorldGen();
