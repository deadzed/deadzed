$(document).ready(function(){
    var font_height = 8;
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

    display.drawText(0, 0, "Hello world!");

    /* custom born/survive rules */
    var map = new ROT.Map.Cellular(width * 3, height * 3, {
        born: [4, 5, 6, 7, 8],
        survive: [2, 3, 4, 5]
    });

    map.randomize(0.9);

    /* generate fifty iterations, show the last one */
    for (var i=3; i>=0; i--) {
        map.create(i ? null : display.DEBUG);
    }
});