// UI helpers: mobile floating menu, simple partners carousel, testimonial slider
document.addEventListener("DOMContentLoaded", function () {
  // Mobile floating menu toggle
  const floatBtn = document.getElementById("floating-menu-btn");
  const floatMenu = document.getElementById("floating-menu");
  if (floatBtn && floatMenu) {
    floatBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      floatMenu.classList.toggle("hidden");
      floatBtn.classList.toggle("active");
    });
    // close when clicking outside
    document.addEventListener("click", function (e) {
      if (!floatMenu.contains(e.target) && !floatBtn.contains(e.target)) {
        floatMenu.classList.add("hidden");
        floatBtn.classList.remove("active");
      }
    });
  }

  // Simple partners horizontal scroller with prev/next buttons
  const partnerWrap = document.querySelector(".partners-track");
  const partnerPrev = document.getElementById("partners-prev");
  const partnerNext = document.getElementById("partners-next");
  if (partnerWrap && (partnerPrev || partnerNext)) {
    const step = partnerWrap.clientWidth * 0.6;
    if (partnerPrev)
      partnerPrev.addEventListener("click", () =>
        partnerWrap.scrollBy({ left: -step, behavior: "smooth" }),
      );
    if (partnerNext)
      partnerNext.addEventListener("click", () =>
        partnerWrap.scrollBy({ left: step, behavior: "smooth" }),
      );
  }

  // Testimonials simple autoplay slider
  const tTrack = document.querySelector(".testimonials-track");
  if (tTrack) {
    let tIndex = 0;
    const tItems = tTrack.children.length;
    setInterval(() => {
      tIndex = (tIndex + 1) % tItems;
      const shift = tIndex * (tTrack.children[0].clientWidth + 24);
      tTrack.style.transform = `translateX(-${shift}px)`;
    }, 4000);
  }

  // Play overlay: when clicking on a play overlay, play the underlying video
  document.querySelectorAll(".video-play-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function () {
      const video = this.closest(".video-card")?.querySelector("video");
      if (video) {
        video.controls = true;
        video.play();
        this.style.display = "none";
      }
    });
  });

  // Dynamically load page-specific scripts (projects/gallery) if not already included
  try {
    const page = window.location.pathname.split("/").pop();
    if (page === "projects.html") {
      if (!document.querySelector('script[src="assets/js/projects.js"]')) {
        const s = document.createElement("script");
        s.src = "assets/js/projects.js";
        document.body.appendChild(s);
      }
    }
    if (page === "gallery.html") {
      if (!document.querySelector('script[src="assets/js/gallery.js"]')) {
        const s2 = document.createElement("script");
        s2.src = "assets/js/gallery.js";
        document.body.appendChild(s2);
      }
    }
  } catch (e) {
    // fail silently
  }
});
