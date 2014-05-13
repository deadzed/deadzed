var ZedMap = function(options) {

    var createSimplex = function(w, h, scale) {
        var noise = new ROT.Noise.Simplex();
        var data = [];
        for (var y=0;y<h;y++) {
            for (var x=0;x<w;x++) {
                data[y * w + x] = noise.get(x/(scale || 150), y/(scale || 150));
            }
        }
        data.width = w;
        data.height = h;
        return data;
    };

    var map = {
        createSimplex: createSimplex
    };

    return map;
};