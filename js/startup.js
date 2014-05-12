$(document).ready(function(){
    var $body = $('body');
    var $container = $('#display_container');
    var $hud = $('#hud');
    $hud.height($body.height() - 38);
    var width = $container.width() / 9;
    var height = $body.height() / 15;
    var display = new ROT.Display({width: width, height: height});
    $container.append(display.getContainer());

    display.drawText(0, 0, "Hello world!");

    /* custom born/survive rules */
    var map = new ROT.Map.Cellular(width * 10, height * 10, {
        born: [4, 5, 6, 7, 8],
        survive: [2, 3, 4, 5]
    });

    map.randomize(0.9);

    /* generate fifty iterations, show the last one */
    for (var i=49; i>=0; i--) {
        map.create(i ? null : display.DEBUG);
    }
});