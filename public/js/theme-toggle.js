document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-theme");
  btn.addEventListener("click", () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
  });
});