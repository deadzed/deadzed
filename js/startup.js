var ZED = {};

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

function getClientHeight() {
    var $document = $(document);
    return $document.height() - (6 + 24);
}

$(document).ready(function(){
    var font_height = 4;
    var font_width = getCharacterWidth('m', font_height);
    var $body = $('body');
    var $container = $('#display_container');
    var $hud = $('#hud');
    var client_height = getClientHeight();
    $hud.height(client_height - 16 * 2);
    var width = $container.width() / font_width;
    var height = client_height / font_height;
    var display = new ROT.Display({width: width, height: height, fontSize: font_height});
    $container.append(display.getContainer());
    $container.css('max-height', client_height + 'px');
    generateMap(display, width, height);

    $('#reset').click(function(){
        generateMap(display, width, height);
    });
});