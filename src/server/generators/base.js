importScripts('noisejs/index.js')

function Generator() {
    this.noise = new Noise(Math.random());
}

Generator.prototype = {
    xScale: 100,
    yScale: 100,
    getAt: function(x, y) {
        var val = this.noise.simplex2(x / this.xScale, y / this.yScale);
        return val;
    },
    setInfo: function(x, y, info) { }
};


function BasicGenerator() {
    Generator.apply(this);
}

BasicGenerator.prototype = {
    __proto__: Generator.prototype,
    threshold: 0.0,

    setInfo: function(x, y, info) {
        var val = this.getAt(x, y);
        info.index = Math.floor(8 * Math.abs(1 + this.getAt(x, y)));
        console.log(info.index);
        return info;
    }
};
