(() => {
  "use strict";

  const games = Array.isArray(window.POCHI_GAMES) ? window.POCHI_GAMES : [];
  const grid = document.querySelector("#game-grid");
  const search = document.querySelector("#game-search");
  const filters = document.querySelector("#genre-filters");
  const count = document.querySelector("#result-count");
  const empty = document.querySelector("#empty-state");
  const recentSection = document.querySelector("#recent-section");
  const recentList = document.querySelector("#recent-list");
  const HISTORY_KEY = "pochi-box-recent-games";
  let activeGenre = "すべて";

  const visualMarkup = {
    blocks: `<div class="visual-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`,
    breaker: `<div class="visual-breaker" aria-hidden="true"><div class="bricks">${"<i></i>".repeat(12)}</div><b></b><span></span></div>`,
    merge: `<div class="visual-merge" aria-hidden="true"><i>•ᴗ•</i><i>•ᴗ•</i><i>•ᴗ•</i><i>•ᴗ•</i></div>`
  };

  function gameCard(game) {
    const article = document.createElement("article");
    article.className = `game-card theme-${game.visual}${game.featured ? " featured" : ""}`;
    article.innerHTML = `
      <a href="${game.url}" class="card-link" data-game-id="${game.id}" aria-label="${game.title}で遊ぶ">
        <div class="game-visual">${visualMarkup[game.visual] || visualMarkup.blocks}<div class="visual-label">${game.featured ? "おすすめ" : game.genre}</div></div>
        <div class="card-body">
          <div class="card-meta"><span>${game.genre}</span>${game.isNew ? "<b>NEW</b>" : ""}</div>
          <h3>${game.title}</h3><p>${game.description}</p>
          <span class="play-button">あそぶ <b aria-hidden="true">→</b></span>
        </div>
      </a>`;
    return article;
  }

  function render() {
    const term = search.value.trim().toLocaleLowerCase("ja");
    const visible = games.filter((game) => (activeGenre === "すべて" || game.genre === activeGenre) && `${game.title} ${game.description}`.toLocaleLowerCase("ja").includes(term));
    grid.replaceChildren(...visible.map(gameCard));
    count.textContent = `${visible.length} GAMES`;
    empty.hidden = visible.length !== 0;
  }

  function setupFilters() {
    const genres = ["すべて", ...new Set(games.map((game) => game.genre))];
    filters.replaceChildren(...genres.map((genre, index) => {
      const button = document.createElement("button");
      button.type = "button"; button.textContent = genre; button.className = "filter-button";
      button.setAttribute("aria-pressed", String(index === 0));
      button.addEventListener("click", () => {
        activeGenre = genre;
        filters.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        render();
      });
      return button;
    }));
  }

  function historyIds() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
  }

  function remember(id) {
    const ids = [id, ...historyIds().filter((item) => item !== id)].slice(0, 5);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(ids)); } catch { /* Storage may be unavailable in private mode. */ }
  }

  function renderHistory() {
    const played = historyIds().map((id) => games.find((game) => game.id === id)).filter(Boolean);
    if (!played.length) return;
    recentSection.hidden = false;
    recentList.replaceChildren(...played.map((game) => {
      const link = document.createElement("a");
      link.href = game.url; link.dataset.gameId = game.id; link.className = `recent-item theme-${game.visual}`;
      link.innerHTML = `<span class="recent-icon">${visualMarkup[game.visual] || "🎮"}</span><span><b>${game.title}</b><small>もう一度あそぶ</small></span><i aria-hidden="true">→</i>`;
      return link;
    }));
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-game-id]");
    if (link) remember(link.dataset.gameId);
  });
  search.addEventListener("input", render);
  document.querySelector("#clear-search").addEventListener("click", () => { search.value = ""; activeGenre = "すべて"; setupFilters(); render(); search.focus(); });
  document.querySelector("#random-game").addEventListener("click", () => {
    if (!games.length) return;
    const game = games[Math.floor(Math.random() * games.length)];
    remember(game.id); window.location.href = game.url;
  });

  setupFilters(); render(); renderHistory();
})();
