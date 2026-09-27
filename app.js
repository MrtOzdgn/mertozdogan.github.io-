// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Masonry + Lightbox =====
// Figures are kept in one master array, in source-order (= priority order,
// best photos first). That order drives both the masonry column layout
// and the lightbox's next/prev sequence, so "next" always means "next by
// priority," never "next by whichever column it landed in."
(function () {
  const container = document.getElementById("masonry");
  const figures = Array.from(container.querySelectorAll(".print"));

  function columnCountFor(width) {
    if (width <= 560) return 1;
    if (width <= 900) return 2;
    return 3;
  }

  // Round-robin the figures across N columns (col0 gets 0,N,2N,...; col1
  // gets 1,N+1,...), which is what actually makes the visual reading order
  // (left to right, then down) match the source order regardless of each
  // photo's height. Plain CSS column-count fills one column completely
  // before starting the next, which does not.
  function layoutMasonry() {
    const n = columnCountFor(window.innerWidth);
    const cols = Array.from({ length: n }, () => document.createElement("div"));
    cols.forEach((col) => (col.className = "masonry-col"));
    figures.forEach((fig, i) => cols[i % n].appendChild(fig));
    container.replaceChildren(...cols);
  }

  layoutMasonry();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMasonry, 150);
  });

  // ----- Lightbox -----
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lb-img");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");

  const imgs = figures.map((f) => f.querySelector("img.shot"));
  let index = -1;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    const el = imgs[index];
    lbImg.src = el.dataset.full;
    lbImg.alt = el.alt;
  }

  function open(i) {
    show(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  imgs.forEach((el, i) => el.addEventListener("click", () => open(i)));

  btnClose.addEventListener("click", close);
  btnNext.addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });
  btnPrev.addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });

  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "ArrowLeft") show(index - 1);
  });
})();
