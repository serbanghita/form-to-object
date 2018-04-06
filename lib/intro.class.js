  var formToObject = function() {
  
    if (!(this instanceof formToObject)) {
      var test = new formToObject();// jscs:ignore requireCapitalizedConstructors
      return test.init.call(test, Array.prototype.slice.call(arguments));
    }
    