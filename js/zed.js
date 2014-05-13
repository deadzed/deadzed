var ZED = {
    version: 0.0,
    UI: null,
    Display: null,
    Map: null,
};



$(document).ready(function(){
    ZED.UI = ZedUI({});
    ZED.Display = ZedDisplay({});
    ZED.Map = ZedMap({});

    var draw_tile = function(x, y, val) {
        val = val * 255;
        val = Math.floor((0.5 * val) + 32);
        var color = "rgb(" + val + "," + val + "," + val +")";
        ZED.Display.draw(x, y, "", "", color);
    };

    ZED.Map.generateMap(draw_tile, ZED.Display.width, ZED.Display.height);

    var $slider = $('#slider');

    $slider.slider({
        value:1,
        min: 0,
        max: 500,
        step: 5,
        slide: function( event, ui ) {
            $( "#amount" ).val(ui.value );
            ZED.Map.generateMap(draw_tile, ZED.Display.width, ZED.Display.height, ui.value);
        }
    });
    $( "#amount" ).val($slider.slider( "value" ));

    $('#reset').click(function(){
        ZED.Map.generateMap(draw_tile, ZED.Display.width, ZED.Display.height, $slider.slider("value"));
    });
});