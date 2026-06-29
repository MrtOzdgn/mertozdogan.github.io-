// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Lightbox =====
(function () {
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lb-img");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");

  // Collect every gallery image in document order
  const imgs = Array.from(document.querySelectorAll(".shot img"));
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

  // Click the dark backdrop (but not the image) to close
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "ArrowLeft") show(index - 1);
  });
})();
