(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.Tools = factory();
  }
}(function () {
  const Tools = {
    throttle: function (fn, wait) {
      let timer
      return function() {
        const context = this;
        const args = arguments
        if (!timer) {
          timer = setTimeout(function() {
            fn.apply(context, args)
            timer = null
          }, wait)
        }
      }
    },
  }
  return Tools;
}))