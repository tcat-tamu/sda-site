module.exports = function factory() {
  return isEmpty;
}

/**
 * Determines whether there is any data contained within the given collection.
 * @param  {Object|any[]} obj
 * @return {boolean}
 */
function isEmpty(obj) {
  if (!obj) {
    return true;
  }

  return isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0;
}

/**
 * Determines whether the given object is an array-like object
 * @param {any} obj
 * @return {boolean}
 */
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
