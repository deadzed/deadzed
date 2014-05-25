(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var WorldGen = require('../worldgen/worldgen');

function World(settings) {
    this.width = settings.width || 50;
    this.height = settings.height || 50;
    this.region_size = settings.region_height || 64;
    this.regions = {};
    this.gen = new WorldGen();
}

World.prototype = {
    forEach: function(x, y, width, height, callback, context) {
		for (var iy = y + height; iy > 0; iy--) {
			var row = [];
			for (var ix = x; ix < x + width; ix++) {
				callback.apply(context, ix, iy, this.at(ix, iy-1));
			}
		}
    },

	query: function (x, y, width, height) {
		var view = [];
		for (var iy = y + height; iy > 0; iy--) {
			var row = [];
			for (var ix = x; ix < x + width; ix++) {
				row.push(this.at(ix, iy-1));
			}
			view.push(row);
		}
		return view;
	},

	at: function (x, y) {
		var ix = Math.floor(x / this.region_size);
		var iy = Math.floor(y / this.region_size);
		var region = this.regions[[ix, iy]];
        if (region === undefined) {
            region = this.gen.generateRegion(ix, iy, this.region_size);
            this.regions[[ix, iy]] = region;
        }
		return region[y-iy*this.region_size][x-ix*this.region_size];
	}
};

module.exports = World;

},{"../worldgen/worldgen":5}],3:[function(require,module,exports){
function Generator() {
    this.noise = new Noise(Math.random());
}

Generator.prototype = {
    xScale: 100,
    yScale: 100,
    getAt: function(x, y) {
        var val = this.noise.simplex2(x / this.xScale, y / this.yScale);
        return val;
    },
    setInfo: function(x, y, info) { }
};


function BasicGenerator() {
    Generator.apply(this);
}

BasicGenerator.prototype = {
    __proto__: Generator.prototype,
    threshold: 0.0,

    setInfo: function(x, y, info) {
        var val = this.getAt(x, y);
        info.index = Math.floor(8 * Math.abs(1 + this.getAt(x, y)));
        console.log(info.index);
        return info;
    }
};

module.exports = {
    BasicGenerator: new BasicGenerator()
}

},{}],4:[function(require,module,exports){

var REGION_TYPES = {
    'wilderness': {
        icon: 'w'
    }
}

function Region(type, x, y, size) {
    this.type = type || 'wilderness';
    this.x = x || 0;
    this.y = y || 0;
    this.size = size;
}

Region.prototype ={

};

module.exports = {
    REGION_TYPES: REGION_TYPES,
    Region: Region
};

},{}],5:[function(require,module,exports){
generators = require("./generators/base");
region = require("./region");

function WorldGen() { }

WorldGen.prototype = {

    generatePoint: function(x, y) {
        return generators.BasicGenerator.setInfo(x, y, {x: x, y: y});
    },

    generateRegion: function(x, y, size) {
        var map = [];
        var yoff = y * size;
        var xoff = x * size;
        for(var m=yoff; m<yoff+ size; m++) {
            var row = [];
            for(var n=xoff; n<xoff + size; n++) {
                row.push(this.generatePoint(n, m));
            }
            map.push(row);
        }
        return map;
    }
};

module.exports = WorldGen;

},{"./generators/base":3,"./region":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var World = require('../services/world/world');
var Renderer = require('../renderer');

function NoiseTest() { }

NoiseTest.prototype = {
    create: function() {
        var width = 500;
        var height = 500;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.world = new World({});
        this.renderer = new Renderer(this.game, this.world, {
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

},{"../renderer":1,"../services/world/world":2}],8:[function(require,module,exports){
'use strict';

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

},{}],9:[function(require,module,exports){
var getCharacterWidth = function(c, size) {
    var $shiv = $('<span style="font-family: monospace; margin:0px; padding:0px; font-size: '+ size + 'px;">' + c + '</span>');
    $(document.documentElement).append($shiv);
    size = $shiv.width();
    $shiv.remove();
    return size;
};

var getClientHeight = function() {
    var $document = $(document);
    // border * 2 + padding * 2
    return $document.height() - (6 + 24);
};


ZedUI = function(options) {

    fontSize = options.fontSize || 16;

    var ui = {
        fontSize: fontSize,
        fontWidth: getCharacterWidth('m', fontSize),
        clientHeight: getClientHeight(),
        version: options.version || "0.0",
    };

    var $body = $('body');

    ui.HUD = {
        $element: $('#hud'),
    };
    ui.HUD.$element.height(ui.clientHeight - 16 * 2);

    return ui;
};

module.exports = {
    getCharacterWidth: getCharacterWidth,
    getClientHeight: getClientHeight,
    ZedUI: ZedUI
};

},{}],10:[function(require,module,exports){
mUI = require('./ui');
sBoot = require('./states/boot');
sPreloader = require('./states/preloader');
sNoise = require('./states/noise');

var ZED = {
    version: 0.0,
    UI: null,
    Game: null
};

$(document).ready(function(){
    ZED.UI = mUI.ZedUI({fontSize: 16});

    var $element = $('#display_container');
    $element.css('height', ZED.UI.clientHeight + 'px');
    var $slider = $('#slider');
    var width = $element.width() / ZED.UI.fontWidth;
    var height = ZED.UI.clientHeight / ZED.UI.fontSize;

    ZED.Game = new Phaser.Game($element.width(), ZED.UI.clientHeight, Phaser.AUTO, 'display_container');
    ZED.Game.state.add('boot', sBoot);
    ZED.Game.state.add('preloader', sPreloader);
    ZED.Game.state.add('noise', sNoise);
    ZED.Game.state.start('boot')


    $slider.slider({
        value:1,
        min: 0,
        max: 500,
        step: 5,
        slide: function( event, ui ) {
            $( "#amount" ).val(ui.value );
        }
    });
    $( "#amount" ).val($slider.slider( "value" ));

    $('#reset').click(function(){ });

});

},{"./states/boot":6,"./states/noise":7,"./states/preloader":8,"./ui":9}]},{},[10])