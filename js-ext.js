"use strict";

require('./lib/function.js');
require('./lib/object.js');
require('./lib/string.js');
require('./lib/array.js');
require('./lib/json.js');
require('./lib/promise.js');

module.exports = {
    createHashMap: require('./extra/hashmap.js').createMap,
    Classes: require('./extra/classes.js'),
    LightMap: require('./extra/lightmap.js')
};