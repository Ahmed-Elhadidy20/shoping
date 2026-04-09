// Sticky header on scroll
window.addEventListener("scroll", () => {
  const head = document.getElementById("head");
  if (!head) return;
  if (window.scrollY > 100) {
    head.classList.add("fixed");
  } else {
    head.classList.remove("fixed");
  }
});
