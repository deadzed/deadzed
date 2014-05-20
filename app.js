(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var WorldGen = require('../worldgen/client');

function NoiseTest(game) {

}

NoiseTest.prototype = {
    create: function() {
        var width = 150;
        var height = 100;
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

},{"../worldgen/client":5}],3:[function(require,module,exports){
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

},{"../worldgen/client":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./region":6}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){
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

},{"./states/boot":1,"./states/noise":2,"./states/preloader":3,"./ui":4}]},{},[7])