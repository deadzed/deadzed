$(document).ready(function(){
    var $body = $('body');
    var $container = $('#display_container');
    var $hud = $('#hud');
    $hud.height($body.height() - 38);
    var display = new ROT.Display({width:$container.width() / 9, height:$body.height() / 15});
    $container.append(display.getContainer());

    display.drawText(0, 0, "Hello world!");
});