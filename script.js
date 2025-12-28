const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const box = document.querySelector(".card-container");

function updateContent(e) {
    if (e.matches) {
        box.innerHTML = `<img src="./assets/Cards (6).svg" alt="cards">`;
    } else {
        box.innerHTML = `<img src="./assets/Cards (5).svg" alt="cards">`;
    }
}

const media = window.matchMedia("(max-width: 600px)");
updateContent(media);
media.addListener(updateContent);




const menu = document.querySelector(".header .menu");
const overlay = document.querySelector(".menu-overlay");
const lines = document.querySelectorAll(".header .menu hr");
const closeBtn = document.querySelector(".menu-close");

let isOpen = false;

function openMenu() {
    gsap.to(lines[0], { rotate: 45, y: 6, duration: 0.25 });
    gsap.to(lines[1], { rotate: -45, y: -6, duration: 0.25 });
    gsap.to(overlay, { left: 0, duration: 0.7, ease: "power3.inOut" });
    isOpen = true;
}

function closeMenu() {
    gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.25 });
    gsap.to(lines[1], { rotate: 0, y: 0, duration: 0.25 });
    gsap.to(overlay, { left: "100%", duration: 0.7, ease: "power3.inOut" });
    isOpen = false;
}

menu.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
});

closeBtn.addEventListener("click", closeMenu);
