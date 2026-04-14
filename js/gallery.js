export function initGallery() {

    const projects = document.querySelectorAll(".project");
    if (!projects.length) return;

    const generarImagenes = (ruta, total, prefijo) =>
        Array.from({ length: total }, (_, i) => `${ruta}${prefijo}${i + 1}.webp`);

    const BASE = window.location.pathname.includes("CIVONEX") ? "/CIVONEX/" : "";

    const galleries = {
        rampa: generarImagenes(`${BASE}img/proyectos/rampa-concreto/`, 8, "ram"),
        vitropiso: generarImagenes(`${BASE}img/proyectos/Vitropiso/`, 6, "img"),
        pintura: generarImagenes(`${BASE}img/proyectos/Pintura/`, 5, "img"),
        cctv: generarImagenes(`${BASE}img/proyectos/CCTV/`, 5, "img"),
        pc: generarImagenes(`${BASE}img/proyectos/PC Mantenimiento/`, 6, "img"),
    };

    const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("modalImg");
    const thumbnailsContainer = document.getElementById("thumbnails");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const counter = document.getElementById("counter");

    if (!modal || !modalImg) return;

    const closeBtn = modal.querySelector(".close");

    let currentImages = [];
    let index = 0;
    let autoplayInterval = null;
    let isAnimating = false;

    let dotsContainer = modal.querySelector(".dots");
    if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.classList.add("dots");
        modal.appendChild(dotsContainer);
    }

    const openModal = () => {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
        startAutoplay();
    };

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        stopAutoplay();
    };

    closeBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeModal();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(nextImage, 4000);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    // 🔥 Precarga inteligente (solo vecinos)
    const preloadNearby = () => {
        if (!currentImages.length) return;

        const next = new Image();
        const prev = new Image();

        next.src = currentImages[(index + 1) % currentImages.length];
        prev.src = currentImages[(index - 1 + currentImages.length) % currentImages.length];
    };

    const updateImage = (direction = "fade") => {
        if (isAnimating) return;
        isAnimating = true;

        modalImg.style.willChange = "transform, opacity";
        modalImg.style.opacity = "0";

        setTimeout(() => {
            modalImg.src = currentImages[index];

            modalImg.style.transition = "none";
            modalImg.style.transform =
                direction === "next"
                    ? "translateX(-80px)"
                    : direction === "prev"
                    ? "translateX(80px)"
                    : "translateX(0)";

            requestAnimationFrame(() => {
                modalImg.style.transition = "all 0.3s ease";
                modalImg.style.transform = "translateX(0)";
                modalImg.style.opacity = "1";
            });
        }, 100);

        setTimeout(() => {
            isAnimating = false;
            modalImg.style.willChange = "auto";
        }, 300);

        counter.textContent = `${index + 1} / ${currentImages.length}`;

        thumbnailsContainer?.querySelectorAll("img").forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });

        dotsContainer?.querySelectorAll("span").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        preloadNearby();
    };

    // 🔥 Lazy real con IntersectionObserver
    const buildThumbnails = () => {
        if (!thumbnailsContainer) return;

        thumbnailsContainer.innerHTML = "";

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    obs.unobserve(img);
                }
            });
        });

        currentImages.forEach((src, i) => {
            const img = document.createElement("img");

            img.loading = "lazy";
            img.decoding = "async";
            img.dataset.src = src;
            img.src = "img/placeholder.webp"; // imagen ligera

            img.addEventListener("click", () => {
                index = i;
                updateImage();
            });

            thumbnailsContainer.appendChild(img);
            observer.observe(img);
        });
    };

    const buildDots = () => {
        dotsContainer.innerHTML = "";

        currentImages.forEach((_, i) => {
            const dot = document.createElement("span");

            dot.addEventListener("click", () => {
                index = i;
                updateImage();
            });

            dotsContainer.appendChild(dot);
        });
    };

    const nextImage = () => {
        index = (index + 1) % currentImages.length;
        updateImage("next");
    };

    const prevImage = () => {
        index = (index - 1 + currentImages.length) % currentImages.length;
        updateImage("prev");
    };

    nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        nextImage();
    });

    prevBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        prevImage();
    });

    projects.forEach((project) => {
        project.addEventListener("click", () => {
            const key = project.dataset.gallery;
            const images = galleries[key];

            if (!images) return;

            currentImages = images;
            index = 0;

            openModal();
            buildThumbnails();
            buildDots();
            updateImage();
        });
    });
}
