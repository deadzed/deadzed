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
                tilemap.putTile(tile.tile, tile.x, tile.y, ground_layer);
            }
            d.fire(tilemap);
        }, this);
        return d;
    }
};

module.exports = new WorldGen();
