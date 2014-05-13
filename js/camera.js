
var ZedCamera = function() {
    var drawTile = function(x, y, val) {
        val = val * 255;
        val = Math.floor((0.5 * val) + 32);
        var color = "rgb(" + val + "," + val + "," + val +")";
        ZED.Display.draw(x, y, "", "", color);
    };

    var drawMap = function(map, ox, oy) {
        for (var x = 0; x < map.width; x++) {
            for (var y = 0; y < map.height; y++) {
                drawTile(x, y, map[(y + oy) * map.width + (x + ox)]);
            }
        }
    };

    var attachCamera = function(map, x, y) {
        var camera = {map: map, x: x, y: y};
        camera.draw = function() {
            drawMap(map, camera.x, camera.y);
        };
        camera.move = function(ox, oy) {
            camera.x += ox;
            camera.y += oy;
            camera.draw();
        };
        camera.draw();
        return camera;
    };

    return {
        drawTile: drawTile,
        drawMap: drawMap,
        attachCamera: attachCamera
    };
};