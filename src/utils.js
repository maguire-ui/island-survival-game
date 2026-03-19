(() => {
  "use strict";

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  window.ISGUtils = Object.freeze({
    clamp,
    lerp,
  });
})();
