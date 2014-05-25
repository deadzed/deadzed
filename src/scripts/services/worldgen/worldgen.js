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
