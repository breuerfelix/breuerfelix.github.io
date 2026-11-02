(() => {
  const trigger = document.getElementById("menu-trigger");
  const navigation = document.getElementById("site-navigation");
  const content = document.querySelector(".wrapper");

  const setMenuOpen = (open) => {
    trigger.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    content.classList.toggle("blurry", open);
  };

  trigger.addEventListener("click", () =>
    setMenuOpen(trigger.getAttribute("aria-expanded") !== "true")
  );
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || trigger.getAttribute("aria-expanded") !== "true") return;
    setMenuOpen(false);
    trigger.focus();
  });
  window.matchMedia("(min-width: 769px)").addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });
})();
