let gantSens = 1.5;
let startScene = true;

function display() {
    /* Creating a new PIXI graphics object. */
    // const background = new PIXI.Graphics();
    const cta = new PIXI.Graphics();
    const veil = new PIXI.Graphics();

    const ctaHeight = 75;

    /* Resizing the canvas to the size of the window. */
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // create a texture from an image path
    const texture = PIXI.Texture.from('/assets/background.png');

    /* create a tiling sprite requires a texture, a width and a height in WebGL the image size should preferably be a power of two */
    const tilingSprite = new PIXI.TilingSprite(
        texture,
        app.screen.width,
        app.screen.height,
    );

    /* Veil: Drawing a rectangle with the color 0xDE3249. */
    veil.beginFill(0x00000, 0.55);
    veil.drawRect(0, 0, window.innerWidth, window.innerHeight);
    veil.endFill();

    /* CTA Panel: Drawing a rectangle with the color 0xDE3249. */
    cta.beginFill(0xDE3249);
    cta.drawRect(0, 0, window.innerWidth, ctaHeight);
    cta.endFill();

    /* Creating a new style for the text. */
    const styleTutoriel = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 45,
        fontWeight: 'bold',
        fill: '#ffffff', // gradient
        stroke: '#000000',
        strokeThickness: 5,
        textBaseline: 'ideographic',
    });

    /* Creating a new style for the text. */
    const styleArrow = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 80,
        fontWeight: 'bold',
        fill: '#ffffff', // gradient
        stroke: '#000000',
        strokeThickness: 5,
        textBaseline: 'ideographic',
    });

    /* Creating a new text object with the text "Swipe to move !" and the style defined in the style variable. */
    const textTutoriel = new PIXI.Text('Swipe to move !', styleTutoriel);

    /* Creating 2 text objects with the text "<" and ">" and the style defined in the styleArrow variable. */
    const leftArrow = new PIXI.Text('<', styleArrow);
    const rightArrow = new PIXI.Text('>', styleArrow);

    const startTextTutoriel = (window.innerWidth / 2) - (textTutoriel.width / 2);
    const arrowHeight = 150;

    /* Centering the text. */
    textTutoriel.x = startTextTutoriel;
    textTutoriel.y = ctaHeight + 25;

    /* Adjusting text with "textTutoriel"'s width */
    leftArrow.x = startTextTutoriel;
    leftArrow.y = window.innerHeight - arrowHeight;
    rightArrow.x = (window.innerWidth / 2) + ((textTutoriel.width / 2) - (rightArrow.width));
    rightArrow.y = window.innerHeight - arrowHeight;

    const hand = PIXI.Sprite.from('assets/gant.png');
    hand.scale.set(0.075);
    hand.angle = -25;

    hand.x = startTextTutoriel;
    hand.y = rightArrow.y + 30;

    /* It's moving the hand. */
    app.ticker.add(() => {
        /* It's checking if the hand is at the right of the right arrow. If it is, it's changing the direction
        of the hand. */
        if (hand.x > (rightArrow.x - rightArrow.width)) {
            gantSens *= -1;
        }

        /* It's checking if the hand is at the left of the left arrow. If it is, it's changing the direction of
        the hand. */
        if (hand.x < (leftArrow.x - leftArrow.width + 20)) {
            gantSens *= -1;
        }

        /* It's moving the hand. */
        hand.x += gantSens;
    });

    app.ticker.add(() => {
        if (!startScene) {
            tilingSprite.tilePosition.y -= 1;
        }
    });

    /* Adding pixi.js elements to the stage. */
    app.stage.addChild(tilingSprite);

    if (startScene) {
        app.stage.addChild(veil);
        app.stage.addChild(textTutoriel);
        app.stage.addChild(leftArrow);
        app.stage.addChild(rightArrow);
        app.stage.addChild(hand);
    }

    app.stage.addChild(cta);

    document.querySelector('canvas').addEventListener('click', () => {
        app.stage.removeChild(textTutoriel);
        app.stage.removeChild(leftArrow);
        app.stage.removeChild(rightArrow);
        app.stage.removeChild(hand);
        app.stage.removeChild(veil);
        startScene = false;
    });
}

/* Creating a new PIXI application. */
const app = new PIXI.Application({
    background: '#1099bb',
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
});

/* CHECK 'RESPONSIVE' DEF WITH VOODOO' */
window.addEventListener("resize", () => {
    display()
})

/* Setting the position of the canvas to absolute. */
app.renderer.view.style.position = 'absolute';

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);

display();
