function display() {
    /* Creating a new PIXI graphics object. */
    const graphics = new PIXI.Graphics();

    /* Resizing the canvas to the size of the window. */
    app.renderer.resize(window.innerWidth, window.innerHeight);

    /*Background: Drawing a rectangle with the color 0xDE3249. */
    graphics.beginFill(0X1099bb);
    graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
    graphics.endFill();

    /*CTA Panel: Drawing a rectangle with the color 0xDE3249. */
    graphics.beginFill(0xDE3249);
    graphics.drawRect(0, 0, window.innerWidth, 75);
    graphics.endFill();

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

    const startTextTutoriel = (window.innerWidth / 2) - (textTutoriel.width / 2)

    /* Centering the text. */
    textTutoriel.x = startTextTutoriel;
    textTutoriel.y = 100;
    
    /* Adjusting text with "textTutoriel"'s width */
    leftArrow.x = startTextTutoriel;
    leftArrow.y = window.innerHeight - 100;
    rightArrow.x = (window.innerWidth / 2) + ((textTutoriel.width / 2) - (rightArrow.width));
    rightArrow.y = window.innerHeight - 100;

    // const hand = PIXI.Sprite.from('assets/hand.png');

    /* Adding pixi.js elements to the stage. */
    app.stage.addChild(graphics);
    app.stage.addChild(textTutoriel);
    app.stage.addChild(leftArrow);
    app.stage.addChild(rightArrow);
}

/* Creating a new PIXI application. */
const app = new PIXI.Application({
    background: '#1099bb',
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
});


window.addEventListener("resize", () => {
    display()
})

/* Setting the position of the canvas to absolute. */
app.renderer.view.style.position = 'absolute';

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);

display()