function generateMap(display, w, h) {
    var noise = new ROT.Noise.Simplex();

    for (var j=0;j<h;j++) {
        for (var i=0;i<w;i++) {
            var val = noise.get(i/150, j/120) * 255;
            var gs = Math.floor((0.5 * val) + 32);
            var color = "rgb(" + gs + "," + gs + "," + gs +")";
            display.draw(i, j, "", "", color);
        }
    }
}

$(document).ready(function(){
    var font_height = 4;
    var font_width = getCharacterWidth('m', font_height);
    var $body = $('body');
    var $container = $('#display_container');
    var $hud = $('#hud');
    $hud.height($body.height() - 38);
    var width = $container.width() / font_width - 5;
    var height = $body.height() / font_height;
    var display = new ROT.Display({width: width, height: height, fontSize: font_height});
    $(display).height(font_height * height - 1);
    $container.append(display.getContainer());

    generateMap(display, width, height);

    $('#reset').click(function(){
        generateMap(display, width, height);
    });
});