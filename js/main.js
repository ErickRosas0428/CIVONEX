// ================= MAIN.JS (OPTIMIZADO PRO) =================
import { initScroll, initParallax } from "./scroll.js";
import { initGallery } from "./gallery.js";

const isDev = true; // 👉 cambiar a false en producción

const log = (...args) => {
    if (isDev) console.log(...args);
};

const error = (...args) => {
    console.error(...args);
};

function initApp() {
    log("[APP] Inicializando módulos...");

    // SCROLL
    try {
        initScroll();
        log("[APP] Scroll OK");
    } catch (err) {
        error("[APP][Scroll]:", err);
    }

    // PARALLAX (solo si existe hero)
    if (document.querySelector(".hero")) {
        try {
            initParallax();
            log("[APP] Parallax OK");
        } catch (err) {
            error("[APP][Parallax]:", err);
        }
    }

    // GALERÍA (solo si existe)
    if (document.querySelector(".project")) {
        try {
            initGallery();
            log("[APP] Galería OK");
        } catch (err) {
            error("[APP][Galería]:", err);
        }
    }
}

// Espera a que TODO cargue (mejor para imágenes y UI)
window.addEventListener("load", initApp);

