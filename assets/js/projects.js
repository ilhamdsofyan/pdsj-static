document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("assets/js/projects.json");
    const data = await res.json();
    // find grid: prefer element with id, otherwise find the existing projects grid by classes
    let grid = document.getElementById("projects-grid");
    if (!grid) {
      grid = document.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3",
      );
      if (grid) grid.id = "projects-grid";
    }
    if (!grid) return;

    data.projects.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "bg-white dark:bg-background-dark rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow group";

      const media =
        item.type === "video"
          ? `
        <div class="relative h-64 bg-gray-300 overflow-hidden video-card">
          <video class="w-full h-full object-cover" poster="${item.poster || ""}" preload="metadata" playsinline muted>
            <source src="${item.video || ""}" type="video/mp4" />
          </video>
          <button class="video-play-overlay absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl">
            <span class="material-symbols-outlined text-5xl">play_arrow</span>
          </button>
        </div>
      `
          : `
        <div class="relative h-64 bg-gray-300 overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      `;

      card.innerHTML = `${media}
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary text-lg">warehouse</span>
            <span class="text-xs font-bold text-primary uppercase">${item.client}</span>
          </div>
          <h3 class="text-lg font-black mb-2">${item.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${item.description}</p>
        </div>`;

      grid.appendChild(card);
    });

    // Bind video overlays
    document
      .querySelectorAll(".video-play-overlay")
      .forEach(function (overlay) {
        overlay.addEventListener("click", function () {
          const video = this.closest(".video-card")?.querySelector("video");
          if (video) {
            video.controls = true;
            video.play();
            this.style.display = "none";
          }
        });
      });
  } catch (err) {
    console.error("projects load error", err);
  }
});
