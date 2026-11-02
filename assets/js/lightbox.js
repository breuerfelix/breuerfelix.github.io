(() => {
  const body = document.body;

  // Image lightbox: click an image in the post content to view it full
  // screen. Images wrapped in a link are left as links.
  const contentImages = document.querySelectorAll(".page-content img");

  if (!contentImages.length) return;

  let overlay;
  const openLightbox = (source) => {
    if (!overlay) {
      // Native dialog supplies modal focus handling and Escape dismissal.
      overlay = document.createElement("dialog");
      overlay.className = "lightbox-overlay";
      overlay.innerHTML = '<button type="button" autofocus>Close image</button><img class="lightbox-image" alt="">';
      overlay.addEventListener("click", () => overlay.close());
      overlay.addEventListener("close", () => {
        if (!overlay.open) {
          body.classList.remove("lightbox-open");
          document.documentElement.classList.remove("lightbox-open");
        }
      });
      document.body.appendChild(overlay);
    }
    const image = overlay.querySelector(".lightbox-image");
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    overlay.setAttribute("aria-label", source.alt || "Image preview");
    source.focus();
    body.classList.add("lightbox-open");
    document.documentElement.classList.add("lightbox-open");
    overlay.showModal();
  };

  contentImages.forEach((image) => {
    if (image.closest("a")) return;
    image.classList.add("zoomable");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Enlarge image: ${image.alt || "Image preview"}`);
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(image);
    });
  });
})();
