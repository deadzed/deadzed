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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./states/boot":1,"./states/noise":2,"./states/preloader":3,"./ui":4}]},{},[5])