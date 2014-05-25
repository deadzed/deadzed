
var REGION_TYPES = {
    'wilderness': {
        icon: 'w'
    }
}

function Region(type, x, y, size) {
    this.type = type || 'wilderness';
    this.x = x || 0;
    this.y = y || 0;
    this.size = size;
}

Region.prototype ={

};
