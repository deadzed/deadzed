
var REGION_TYPES = {
    'wilderness': {
        icon: 'w'
    }
}

function Region(type, x, y, size) {
    this.type = 'wilderness';
    this.x = 0;
    this.y = 0;
    this.size = size;
}

Region.prototype ={

};

function WorldGen() { }

WorldGen.prototype = {

    init: function(game) {
        this.game = game;
        this.maps = {};
    },

    makeMap: function(name, width, height, tilemap, twidth, theight, ntiles) {
        this.maps[name] = {
            tilemap: new Phaser.Tilemap()
        }
    }

};


module.exports = new WorldGen();
