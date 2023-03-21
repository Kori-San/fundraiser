/* Creating a new PIXI application. */
const app = new PIXI.Application({
    background: '#1099bb',
    width: 500,
    height: 500,
    antialias: true,
    transparent: false,
});

window.addEventListener("resize", () => {
    /* Resizing the canvas to the size of the window. */
    app.renderer.resize(window.innerWidth, window.innerHeight);
})

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);