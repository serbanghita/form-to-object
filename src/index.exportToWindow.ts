import {IDefine, IModule, Window} from "./types";
import formToObject from "./index";

declare let define: IDefine;
declare let module: IModule;
declare let window: Window;

(function(window) {
  'use strict';
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
