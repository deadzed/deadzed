mUI = require('./ui');
sBoot = require('./states/boot');
sPreloader = require('./states/preloader');
sNoise = require('./states/noise');

var ZED = {
    version: 0.0,
    UI: null,
    Game: null
};

$(document).ready(function(){
    ZED.UI = mUI.ZedUI({fontSize: 16});

    var $element = $('#display_container');
    $element.css('height', ZED.UI.clientHeight + 'px');
    var $slider = $('#slider');
    var width = $element.width() / ZED.UI.fontWidth;
    var height = ZED.UI.clientHeight / ZED.UI.fontSize;

    ZED.Game = new Phaser.Game($element.width(), ZED.UI.clientHeight, Phaser.AUTO, 'display_container');
    ZED.Game.state.add('boot', sBoot);
    ZED.Game.state.add('preloader', sPreloader);
    ZED.Game.state.add('noise', sNoise);
    ZED.Game.state.start('boot')


    $slider.slider({
        value:1,
        min: 0,
        max: 500,
        step: 5,
        slide: function( event, ui ) {
            $( "#amount" ).val(ui.value );
        }
    });
    $( "#amount" ).val($slider.slider( "value" ));

    $('#reset').click(function(){ });

});
