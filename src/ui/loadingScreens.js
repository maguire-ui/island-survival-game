(() => {
  "use strict";

  function installLoadingScreens(deps = null) {
    const resolved = deps && typeof deps === "object" ? deps : Object.create(null);
    const state = resolved.state;
    const loadingOverlayEl = resolved.loadingOverlayEl;
    const loadingTitleEl = resolved.loadingTitleEl;
    const loadingStageEl = resolved.loadingStageEl;
    const clearStartFlowWatchdog = typeof resolved.clearStartFlowWatchdog === "function"
      ? resolved.clearStartFlowWatchdog
      : () => {};
    const armAutoPerformanceWarmup = typeof resolved.armAutoPerformanceWarmup === "function"
      ? resolved.armAutoPerformanceWarmup
      : () => {};
    const clamp = typeof resolved.clamp === "function"
      ? resolved.clamp
      : ((value, min, max) => Math.min(Math.max(value, min), max));

    function setLoadingOverlayVisible(visible, titleText = null, stageText = null) {
      state.loadingVisible = !!visible;
      if (typeof titleText === "string") {
        state.loadingTitle = titleText;
      }
      if (typeof stageText === "string") {
        state.loadingStage = stageText;
      }
      if (loadingTitleEl && typeof state.loadingTitle === "string" && state.loadingTitle) {
        loadingTitleEl.textContent = state.loadingTitle;
      }
      if (loadingStageEl && typeof state.loadingStage === "string" && state.loadingStage) {
        loadingStageEl.textContent = state.loadingStage;
      }
      if (loadingOverlayEl) {
        loadingOverlayEl.classList.toggle("hidden", !state.loadingVisible);
      }
    }

    function showLoadingOverlay(titleText = "Loading", stageText = "Preparing...") {
      setLoadingOverlayVisible(true, titleText, stageText);
    }

    function setLoadingOverlayStage(stageText = "Preparing...", titleText = null) {
      setLoadingOverlayVisible(true, titleText, stageText);
    }

    function hideLoadingOverlay() {
      clearStartFlowWatchdog();
      setLoadingOverlayVisible(false);
      armAutoPerformanceWarmup();
    }

    function runDeferredLoadingTask(options) {
      const opts = options && typeof options === "object" ? options : Object.create(null);
      const title = typeof opts.title === "string" && opts.title ? opts.title : "Loading";
      const stage = typeof opts.stage === "string" && opts.stage ? opts.stage : "Preparing...";
      const finalizeStage = typeof opts.finalStage === "string" && opts.finalStage ? opts.finalStage : "Ready";
      const holdMs = clamp(Math.floor(Number(opts.holdMs) || 120), 0, 1200);
      const task = typeof opts.task === "function" ? opts.task : null;
      const onError = typeof opts.onError === "function" ? opts.onError : null;
      if (!task) return;
      showLoadingOverlay(title, stage);
      const run = () => {
        window.setTimeout(() => {
          try {
            task();
            setLoadingOverlayStage(finalizeStage, title);
          } catch (err) {
            console.error("Deferred loading task failed", err);
            if (onError) {
              try {
                onError(err);
              } catch (callbackErr) {
                console.error("Deferred loading recovery handler failed", callbackErr);
              }
            }
          } finally {
            window.setTimeout(() => {
              if (state.loadingVisible) hideLoadingOverlay();
            }, holdMs);
          }
        }, 0);
      };
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => run());
      } else {
        run();
      }
    }

    return {
      hideLoadingOverlay,
      runDeferredLoadingTask,
      setLoadingOverlayStage,
      setLoadingOverlayVisible,
      showLoadingOverlay,
    };
  }

  window.ISGUI = window.ISGUI || Object.create(null);
  window.ISGUI.loadingScreens = Object.freeze({
    installLoadingScreens,
  });
})();
