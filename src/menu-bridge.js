(() => {
  function setMenuView(view) {
    const next = view === "play" || view === "options" ? view : "main";
    const order = { main: 0, play: 1, options: 2 };
    const nextOrder = order[next] ?? 0;
    const shell = document.getElementById("startMenuShell") || document.querySelector(".start-menu-shell");
    const main = document.getElementById("startMainMenu");
    const play = document.getElementById("startPlayMenu");
    const options = document.getElementById("startOptionsMenu");
    const views = [
      { id: "main", el: main },
      { id: "play", el: play },
      { id: "options", el: options },
    ];
    for (const entry of views) {
      if (!entry.el) continue;
      const isActive = entry.id === next;
      const viewOrder = order[entry.id] ?? 0;
      entry.el.classList.remove("active", "view-left", "view-right");
      if (!isActive) {
        entry.el.classList.add(viewOrder < nextOrder ? "view-left" : "view-right");
      }
      entry.el.classList.toggle("active", isActive);
      entry.el.setAttribute("aria-hidden", isActive ? "false" : "true");
    }
    if (shell) {
      shell.dataset.view = next;
    }
  }

  function isgMenuAction(action) {
    try {
      const api = window.__isgMenuApi || null;
      if (api) {
        if (action === "play" && typeof api.showPlay === "function") return api.showPlay();
        if (action === "options" && typeof api.showOptions === "function") return api.showOptions();
        if (action === "back" && typeof api.showMain === "function") return api.showMain();
        if (action === "quit" && typeof api.quit === "function") return api.quit();
        if (action === "solo" && typeof api.solo === "function") return api.solo();
        if (action === "host" && typeof api.host === "function") return api.host();
        if (action === "join" && typeof api.join === "function") return api.join();
        if (action === "resetSeed" && typeof api.resetSeed === "function") return api.resetSeed();
      }
    } catch (err) {
      console.warn("Menu action bridge call failed.", err);
    }
    if (action === "play") setMenuView("play");
    else if (action === "options") setMenuView("options");
    else if (action === "back") setMenuView("main");
    else if (action === "solo" || action === "host" || action === "join" || action === "resetSeed") {
      window.__pendingMenuAction = action;
    }
  }

  function bindMenuEventDelegate() {
    if (document.__menuDelegateBound) return;
    document.__menuDelegateBound = true;
    document.addEventListener("click", (event) => {
      const btn = event.target && event.target.closest ? event.target.closest("button") : null;
      if (!btn || !btn.id) return;
      const map = {
        menuPlayBtn: "play",
        menuOptionsBtn: "options",
        menuQuitBtn: "quit",
        menuBackFromPlayBtn: "back",
        menuBackFromOptionsBtn: "back",
        menuResetWorldBtn: "resetSeed",
        soloBtn: "solo",
        hostBtn: "host",
        joinBtn: "join",
      };
      const action = map[btn.id];
      if (action) {
        event.preventDefault();
        isgMenuAction(action);
      }
    });
  }

  window.isgMenuAction = isgMenuAction;
  bindMenuEventDelegate();
  window.__menuBridgeTimer = window.__menuBridgeTimer || setInterval(() => {
    if (!window.__pendingMenuAction) return;
    if (!window.__isgMenuApi) return;
    const action = window.__pendingMenuAction;
    window.__pendingMenuAction = null;
    isgMenuAction(action);
  }, 200);
})();
