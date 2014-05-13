
var getCharacterWidth = function(c, size) {
    var $shiv = $('<span style="font-family: monospace; margin:0px; padding:0px; font-size: '+ size + 'px;">' + c + '</span>');
    $(document.documentElement).append($shiv);
    size = $shiv.width();
    $shiv.remove();
    return size;
};

var getClientHeight = function() {
    var $document = $(document);
    // border * 2 + padding * 2
    return $document.height() - (6 + 24);
};


ZedUI = function(options) {

    fontSize = options.fontSize || 4;

    var ui = {
        fontSize: fontSize,
        fontWidth: getCharacterWidth('m', fontSize),
        clientHeight: getClientHeight(),
        version: options.version || "0.0",
    };

    var $body = $('body');

    ui.HUD = {
        $element: $('#hud'),
    };
    ui.HUD.$element.height(ui.clientHeight - 16 * 2);

    return ui;
};