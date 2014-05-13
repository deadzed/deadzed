var ZedDisplay = function(options) {

    var $element = $('#display_container');
    var width = $element.width() / ZED.UI.fontWidth;
    var height = ZED.UI.clientHeight / ZED.UI.fontSize;

    var display = new ROT.Display({
        width: width,
        height: height,
        fontSize: ZED.UI.fontSize,
    });
    display.$element = $element;
    display.width = width;
    display.height = height;

    $element.append(display.getContainer());
    $element.css('max-height', ZED.UI.clientHeight + 'px');

    return display;
};