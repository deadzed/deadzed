onmessage = (function() {

    var world = new World();

    return function (oEvent) {
        var handler  = {
            init: world.init,
            at: world.at,
            query: world.query
        }[oEvent.data.message];

        var result = handler.apply(world, oEvent.data.args);

        postMessage({
            "id": oEvent.data.id,
            "result": result
        });
    };
})();



