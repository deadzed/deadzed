function getCharacterWidth(c, size) {
    var $shiv = $('<span style="font-family: monospace; margin:0px; padding:0px; font-size: '+ size + 'px;">' + c + '</span>');
    $(document.documentElement).append($shiv);
    size = $shiv.width();
    $shiv.remove();
    return size;
}