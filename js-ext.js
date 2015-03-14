"use strict";

require('./lib/function.js');
require('./lib/object.js');
require('./lib/string.js');
require('./lib/array.js');
require('./lib/json.js');
require('./lib/promise.js');
require('./extra/observers.js');

module.exports = {
    createHashMap: require('./extra/hashmap.js').createMap,
    Classes: require('./extra/classes.js'),
    LightMap: require('./extra/lightmap.js'),
    reservedWords: require('./extra/reserved-words.js')
};