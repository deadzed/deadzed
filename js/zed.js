var ZED = {
    version: 0.0,
    UI: null,
    Display: null,
    Map: null,
    Camera: null,
};



$(document).ready(function(){
    ZED.UI = ZedUI({fontSize: 16});
    ZED.Display = ZedDisplay({});
    ZED.Map = ZedMap({});
    ZED.Camera = ZedCamera({});

    var state = {
        map: null,
        cam: null,
    };

    var $slider = $('#slider');

    var new_map = function(scale) {
        state.map = ZED.Map.createSimplex(ZED.Display.width * 4, ZED.Display.height * 4, scale || $slider.slider("value"));
        state.cam = ZED.Camera.attachCamera(state.map, 0, 0);
    };

    $slider.slider({
        value:1,
        min: 0,
        max: 500,
        step: 5,
        slide: function( event, ui ) {
            $( "#amount" ).val(ui.value );
            new_map(ui.value);
        }
    });
    $( "#amount" ).val($slider.slider( "value" ));

    $('#reset').click(function(){
        new_map();
    });

    new_map();

    $(document).keypress(function(evt) {
        if (evt.which == 106)
            state.cam.move(0, 1);
        else if (evt.which == 107)
            state.cam.move(0, -1);
        else if (evt.which == 104)
            state.cam.move(-1, 0);
        else if (evt.which == 108)
            state.cam.move(1, 0);
    });
});