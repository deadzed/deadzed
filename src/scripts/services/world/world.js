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
