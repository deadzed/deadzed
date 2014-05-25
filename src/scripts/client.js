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

var Client = function() { }

Client.prototype = {
    msg: (function () {

        var data = {
            nextID: 1,
            listeners: {}
        };

        var oParser = new Worker("server.js");

        oParser.onmessage = function (oEvent) {
            if (data.listeners[oEvent.data.id]) {
                var callback = data.listeners[oEvent.data.id];
                callback.fire(oEvent.data.result);
            }
            delete data.listeners[oEvent.data.id];
        };

        return function () {
            // message callback deferred
            var d = new Deferred();
            // map deferred to message id
            data.listeners[data.nextID] = d;
            // create real array from arguments
            var args = [];
            for (var i=1; i<arguments.length; i++) {
                args.push(arguments[i]);
            }
            // post the message
            oParser.postMessage({
                "id": data.nextID,
                "message": arguments[0],
                "args": args
            });
            // increment the message id
            data.nextID += 1;
            // return the deferred
            return d;
        };
    })()
};

module.exports = new Client();
