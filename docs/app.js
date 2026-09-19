const PAGE_SIZE = 10;
let allItems = [];
let filtered = [];
let rendered = 0;
let activeCategory = "All";

const feed = document.getElementById("feed");
const sentinel = document.getElementById("sentinel");
const empty = document.getElementById("empty");
const search = document.getElementById("search");
const smallOnly = document.getElementById("smallOnly");
const updated = document.getElementById("updated");

const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

function matchesSmall(item) {
  if (!smallOnly.checked) return true;
  const p = Number(item.total_parameters_b);
  return Number.isFinite(p) && p <= 12;
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  filtered = allItems.filter(item => {
    const categoryMatch = activeCategory === "All" ||
      item.category === activeCategory ||
      (Array.isArray(item.tags) && item.tags.includes(activeCategory));
    const text = [
      item.title, item.summary, item.company, item.model_name,
      item.model_type, item.best_use_cases, ...(item.tags || [])
    ].filter(Boolean).join(" ").toLowerCase();
    return categoryMatch && matchesSmall(item) && (!q || text.includes(q));
  });
  rendered = 0;
  feed.innerHTML = "";
  renderMore();
  empty.hidden = filtered.length !== 0;
}

function renderCard(item) {
  const sources = (item.sources || []).map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name || "Source")} ↗</a>`
  ).join("");

  const params = item.total_parameters_b == null ? "—" :
    `${esc(item.total_parameters_b)}B total${item.active_parameters_b ? ` / ${esc(item.active_parameters_b)}B active` : ""}`;

  const tags = (item.tags || []).slice(0, 5).map(t => `<span class="badge">${esc(t)}</span>`).join("");
  const important = item.importance === "Important" ? '<span class="badge important">Important</span>' : "";

  return `
    <article class="card">
      <div class="meta">
        ${important}
        <span>${esc(item.published_at || "")}</span>
        <span>•</span>
        <span>${esc(item.company || item.category || "AI")}</span>
        ${tags}
      </div>
      <h2>${esc(item.title)}</h2>
      <p class="summary">${esc(item.summary)}</p>
      <div class="details">
        <div class="detail"><strong>Type</strong><span>${esc(item.model_type || item.category || "Update")}</span></div>
        <div class="detail"><strong>Input → Output</strong><span>${esc(item.input_output || "—")}</span></div>
        <div class="detail"><strong>Parameters</strong><span>${params}</span></div>
        <div class="detail"><strong>Local</strong><span>${item.local === true ? "Yes" : item.local === false ? "No" : "Depends"}</span></div>
        <div class="detail"><strong>Hardware</strong><span>${esc(item.hardware || "—")}</span></div>
        <div class="detail"><strong>Best use</strong><span>${esc(item.best_use_cases || "—")}</span></div>
        <div class="detail"><strong>Worth testing</strong><span>${esc(item.worth_testing || "—")}</span></div>
        <div class="detail"><strong>Confidence</strong><span>${esc(item.confidence || "—")}</span></div>
      </div>
      <div class="sources">${sources}</div>
    </article>`;
}

function renderMore() {
  const next = filtered.slice(rendered, rendered + PAGE_SIZE);
  if (!next.length) return;
  feed.insertAdjacentHTML("beforeend", next.map(renderCard).join(""));
  rendered += next.length;
}

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    applyFilters();
  });
});

search.addEventListener("input", applyFilters);
smallOnly.addEventListener("change", applyFilters);

new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) renderMore();
}, { rootMargin: "500px" }).observe(sentinel);

fetch("./news.json", { cache: "no-store" })
  .then(r => {
    if (!r.ok) throw new Error("Could not load news.json");
    return r.json();
  })
  .then(data => {
    allItems = Array.isArray(data) ? data : (data.items || []);
    allItems.sort((a,b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
    const latest = allItems[0]?.published_at;
    updated.textContent = latest ? `Latest item: ${latest}` : "Feed ready — awaiting first update";
    applyFilters();
  })
  .catch(err => {
    updated.textContent = "Feed unavailable";
    empty.hidden = false;
    empty.textContent = err.message;
  });