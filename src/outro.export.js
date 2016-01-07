  /**
   * Expose the final class.
   * @type Function
   */
  
  if (typeof define === 'function' && define.amd) {
    // AMD/requirejs: Define the module
    define(function() {
      return formToObject;
    });
  } else {
    // Browser: Expose to window
    window.formToObject = formToObject;
  }
