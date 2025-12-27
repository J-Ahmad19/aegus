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
let isOpen = false; // track state

menu.addEventListener("click", () => {
    if (!isOpen) {
        // OPEN (turn into X)
        gsap.to(".header .menu hr:nth-of-type(1)", {
            rotate: 45,
            y: 6,
            duration: 0.3,
            transformOrigin: "center"
        });

        gsap.to(".header .menu hr:nth-of-type(2)", {
            rotate: -45,
            y: -6,
            duration: 0.3,
            transformOrigin: "center"
        });

        gsap.to(".menu-overlay", {
            left: "-30%",
            ease: "power3.inOut",
            duration: 1,
        })
    } else {
        // CLOSE (reset to hamburger)
        gsap.to(".header .menu hr:nth-of-type(1)", {
            rotate: 0,
            y: 0,
            duration: 0.3
        });

        gsap.to(".header .menu hr:nth-of-type(2)", {
            rotate: 0,
            y: 0,
            duration: 0.3
        });
        gsap.to(".menu-overlay", {
            left: "-100%",
            ease: "power3.inOut",
            duration: 1,
        })
    }

    isOpen = !isOpen;
});
