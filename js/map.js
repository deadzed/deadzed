var ZedMap = function(options) {

    var generateMap = function(cb, w, h, scale) {
        var noise = new ROT.Noise.Simplex();
        for (var j=0;j<h;j++) {
            for (var i=0;i<w;i++) {
                var val = noise.get(i/(scale || 150), j/(scale || 150));
                cb(i, j, val);
            }
        }
    };

    var map = {
        generateMap: generateMap
    };

    return map;
};