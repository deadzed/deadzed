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

    //ROT.RNG.setSeed(1234);
    var map = new ROT.Map.Digger(width, height);
    map.create(display.DEBUG);

    var drawDoor = function(x, y) {
        display.draw(x, y, "", "", "brown");
    };

    var rooms = map.getRooms();
    for (var i=0; i<rooms.length; i++) {
        var room = rooms[i];
        console.log("Room #%s: [%s, %s] => [%s, %s]".format(
            (i+1),
            room.getLeft(), room.getTop(),
            room.getRight(), room.getBottom()
        ));

        room.getDoors(drawDoor);
    }
});