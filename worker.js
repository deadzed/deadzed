importScripts('noisejs/index.js');

var noise = new Noise(Math.random());

var generateMap = function(width, height, tiles) {
    var map = [];
    for(var x=0; x<width; x++) {
        for(var y=0; y<height; y++) {
            var val = noise.simplex2(x / 100, y / 100);
            var tile = 8;
            if (val > 0) {
                tile = 11;
            }
            map.push({x:x, y:y, tile:tile});
        }
    }
    return map;
};


onmessage = function (oEvent) {
    console.log(oEvent.data);
    var handler  = {
        generateMap: generateMap
    }[oEvent.data.message];
    var result = handler.apply(null, oEvent.data.args);
	postMessage({
		"id": oEvent.data.id,
		"evaluated": result
	});
};


