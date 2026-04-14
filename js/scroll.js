// ================= SCROLL.JS (OPTIMIZADO PRO) =================

export function initScroll() {

    const header = document.querySelector("header");

    // 🔥 Delegación de eventos (más eficiente)
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // 🔥 Altura dinámica
        const headerHeight = header ? header.offsetHeight : 0;

        const top =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

        window.scrollTo({
            top,
            behavior: "smooth"
        });
    });
}


export function initParallax() {

    const hero = document.querySelector(".hero");
    if (!hero) return;

    let ticking = false;

    const updateParallax = () => {
        const offset = window.scrollY * 0.4;
        hero.style.backgroundPosition = `center ${offset}px`;
        ticking = false;
    };

    // 🔥 Scroll optimizado con requestAnimationFrame
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}