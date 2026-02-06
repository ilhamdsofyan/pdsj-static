// Fetch dan render gallery items dari gallery.json dengan filter dan pagination
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("assets/js/gallery.json");
    const data = await response.json();

    const galleryGrid = document.getElementById("gallery-grid");
    const galleryFilters = document.getElementById("gallery-filters");
    const galleryPagination = document.getElementById("gallery-pagination");

    if (!galleryGrid) return;

    const itemsPerPage = 6;
    let currentPage = 1;
    let currentFilter = "all";
    let filteredItems = data.gallery;

    // Create filter tabs
    if (galleryFilters) {
      const filters = [
        { value: "all", label: "Semua" },
        { value: "image", label: "Gambar" },
        { value: "video", label: "Video" },
      ];

      const filterHTML = filters
        .map(
          (filter) =>
            `<button class="filter-btn px-6 py-2 rounded-lg font-semibold transition-all ${
              filter.value === "all"
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }" data-filter="${filter.value}">${filter.label}</button>`,
        )
        .join("");

      galleryFilters.innerHTML = `<div class="flex gap-3 flex-wrap">${filterHTML}</div>`;

      // Add filter event listeners
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          document.querySelectorAll(".filter-btn").forEach((b) => {
            b.classList.remove("bg-primary", "text-white");
            b.classList.add(
              "bg-gray-200",
              "dark:bg-gray-700",
              "text-gray-800",
              "dark:text-gray-200",
            );
          });

          this.classList.add("bg-primary", "text-white");
          this.classList.remove(
            "bg-gray-200",
            "dark:bg-gray-700",
            "text-gray-800",
            "dark:text-gray-200",
          );

          currentFilter = this.dataset.filter;
          currentPage = 1;
          applyFilter();
        });
      });
    }

    function applyFilter() {
      filteredItems =
        currentFilter === "all"
          ? data.gallery
          : data.gallery.filter((item) => item.type === currentFilter);

      renderGallery();
      renderPagination();
    }

    function renderGallery() {
      galleryGrid.innerHTML = "";

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemsToDisplay = filteredItems.slice(startIndex, endIndex);

      itemsToDisplay.forEach((item) => {
        const galleryCard = document.createElement("div");
        galleryCard.className =
          "bg-white dark:bg-background-dark rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow group";

        let cardContent = "";

        if (item.type === "image") {
          cardContent = `
            <div class="relative h-64 bg-gray-300 overflow-hidden">
              <img
                src="${item.image}"
                alt="${item.title}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          `;
        } else if (item.type === "video") {
          cardContent = `
            <div class="relative h-64 bg-gray-300 overflow-hidden video-card">
              <video
                class="w-full h-full object-cover"
                poster="${item.poster}"
                preload="metadata"
                playsinline
                muted
              >
                <source src="${item.video}" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button class="video-play-overlay absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl">
                <span class="material-symbols-outlined text-5xl">play_arrow</span>
              </button>
            </div>
          `;
        }

        const typeLabel = item.type === "image" ? "Foto" : "Video";
        const typeIcon = item.type === "image" ? "image" : "videocam";

        galleryCard.innerHTML =
          cardContent +
          `
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary text-lg">${typeIcon}</span>
              <span class="text-xs font-bold text-primary uppercase">${typeLabel}</span>
            </div>
            <h3 class="text-lg font-black mb-2">${item.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              ${item.description}
            </p>
          </div>
        `;

        galleryGrid.appendChild(galleryCard);
      });

      // Reinitialize video play overlays setelah render
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
    }

    function renderPagination() {
      if (!galleryPagination) return;

      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      galleryPagination.innerHTML = "";

      if (totalPages <= 1) return;

      // Previous button
      const prevBtn = document.createElement("button");
      prevBtn.className = `px-4 py-2 rounded-lg transition-all ${
        currentPage === 1
          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/80"
      }`;
      prevBtn.textContent = "← Sebelumnya";
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderGallery();
          renderPagination();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      galleryPagination.appendChild(prevBtn);

      // Page numbers
      const pageContainer = document.createElement("div");
      pageContainer.className = "flex gap-2";

      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = `px-3 py-2 rounded-lg transition-all ${
          i === currentPage
            ? "bg-primary text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`;
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          renderGallery();
          renderPagination();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        pageContainer.appendChild(pageBtn);
      }

      galleryPagination.appendChild(pageContainer);

      // Next button
      const nextBtn = document.createElement("button");
      nextBtn.className = `px-4 py-2 rounded-lg transition-all ${
        currentPage === totalPages
          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary/80"
      }`;
      nextBtn.textContent = "Berikutnya →";
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderGallery();
          renderPagination();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      galleryPagination.appendChild(nextBtn);
    }

    // Initial render
    renderGallery();
    renderPagination();
  } catch (error) {
    console.error("Error loading gallery:", error);
  }
});
