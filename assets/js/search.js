(async () => {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const status = document.getElementById("search-status");
  let posts;
  let state = "loading";

  const render = () => {
    results.replaceChildren();
    if (state !== "ready") {
      status.textContent = state === "loading" ? "Loading articles…" : "Search is unavailable. Please reload the page.";
      return;
    }
    const query = input.value.trim().toLowerCase();
    if (!query) {
      status.textContent = "";
      return;
    }
    const terms = query.split(/\s+/);
    const matches = posts.filter(post =>
      Object.values(post).some(value => terms.every(term => value.toLowerCase().includes(term)))
    ).slice(0, 10);
    status.textContent = matches.length
      ? `${matches.length} result${matches.length === 1 ? "" : "s"}`
      : "No results found";
    for (const post of matches) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = post.url;
      link.title = post.description;
      link.textContent = post.title;
      item.append(link);
      results.append(item);
    }
  };

  input.addEventListener("input", render);
  render();
  try {
    const response = await fetch("/assets/search.json");
    if (!response.ok) throw new Error(`Search request failed: ${response.status}`);
    posts = await response.json();
    state = "ready";
  } catch (error) {
    state = "error";
    console.error(error);
  }
  render();
})();
