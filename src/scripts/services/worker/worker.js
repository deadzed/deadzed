function Deferred() {
    this.callback = null;
    this.context = null;
}

Deferred.prototype = {
    setCallback: function(cb, ctx) {
        this.callback = cb;
        this.context = ctx;
    },
    fire: function() {
        if (this.callback) {
            this.callback.apply(this.context, arguments);
        }
    }
};


var Worker = function() { }

Worker.prototype = {
    _callto: (function () {

        var data = {
            nextID: 1,
            listeners: {}
        };

        oParser = new Worker("worker.js");

        oParser.onmessage = function (oEvent) {
            if (data.listeners[oEvent.data.id]) {
                var callback = data.listeners[oEvent.data.id];
                callback.fire(oEvent.data.evaluated);
            }
            delete data.listeners[oEvent.data.id];
        };

        return function () {
            var d = new Deferred();
            data.listeners[data.nextID] = d;
            var args = [];
            for (var i=1; i<arguments.length; i++) {
                args.push(arguments[i]);
            }
            oParser.postMessage({
                "id": data.nextID,
                "message": arguments[0],
                "args": args
            });
            data.nextID += 1;
            return d;
        };
    })()
};
