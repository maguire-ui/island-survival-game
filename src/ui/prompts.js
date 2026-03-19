(() => {
  "use strict";

  function installPrompts(deps = null) {
    const resolved = deps && typeof deps === "object" ? deps : Object.create(null);
    const state = resolved.state;
    const promptEl = resolved.promptEl;
    const compactPromptText = typeof resolved.compactPromptText === "function"
      ? resolved.compactPromptText
      : ((text) => String(text || ""));

    function setPrompt(text, duration = 0) {
      state.promptText = compactPromptText(text);
      state.promptTimer = duration;
    }

    function updatePrompt(dt) {
      if (state.promptTimer > 0) {
        state.promptTimer -= dt;
        if (state.promptTimer <= 0) {
          state.promptText = "";
        }
      }

      if (state.promptText) {
        promptEl.textContent = state.promptText;
        promptEl.classList.add("visible");
      } else {
        promptEl.classList.remove("visible");
      }
    }

    return {
      setPrompt,
      updatePrompt,
    };
  }

  window.ISGUI = window.ISGUI || Object.create(null);
  window.ISGUI.prompts = Object.freeze({
    installPrompts,
  });
})();
