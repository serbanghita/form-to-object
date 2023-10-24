import {init} from "./core";
import {IDefine, IFormToObjectArgs, IModule, Window} from "./types";

declare let define: IDefine;
declare let module: IModule;
declare let window: Window;

(function(window) {
  'use strict';

  const formToObject = function (...args: IFormToObjectArgs[]) {
    return init(...args);
  };

  /**
   * Expose the final class.
   * @type Function
   */

  if (typeof define === 'function' && define?.amd) {
    // AMD/requirejs: Define the module
    define(function() {
      return formToObject;
    });
  } else if (typeof module === 'object' && module?.exports) {
    module.exports = formToObject;
  } else {
    // Browser: Expose to window
    window['formToObject'] = formToObject;
  }
})(window);
