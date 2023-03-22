/* All the scenes booleans */
let startScene = true;
let endScene = false;
let isDown = false;

/* This var is used to stock the position of the player's mouse / touch */
let userX = 0;

function display() {
    /*
    * Initialization:
    * Make Canvas size as same as window's size to allow the app to be 'responsive'
    */
    app.renderer.resize(window.innerWidth, window.innerHeight);

    /*
    * Parameters and Variables:
    * Those variables are used in the code to build and display most of the game.
    * 
    * The values had been put in variables since they're used multiple times and
    * it allows the devs to change the vars if needed to polish the display. 
    */
    // Background Parameters
    const backgroundSpeed = 1;

    // Call To Action Parameters
    const ctaHeight = app.screen.height - 75;

    // Arrows Parameters
    const arrowHeight = ctaHeight - 125;

    // Glove Parameters
    const gloveScale = 0.075;
    const gloveAngle = -25;
    const gloveHeightStep = 30;
    let gloveSpeed = 1.5;

    // Plane Parameters
    const planeScale = 0.1;
    const planeStep = 125;
    const planeSpeed = 5;

    // Download logo Parameters
    const downloadLogoScale = 0.35;
    const downloadLogoMaxAngle = 15;
    let downloadLogoAngle = 0.5;

    /*
    * Background creation:
    * Create a tiling sprite using a background texture and the screen's width and height.
    * In WebGL the image size should preferably be a power of two.
    */
    const background = new PIXI.TilingSprite(
        PIXI.Texture.from('/assets/background.png'),
        1920, // TODO
        982, // TODO
    );

    /* It's centering the background to the middle of the screen. */
    background.x = (app.screen.width / 2) - (background.width / 2);

    /* 
    * Veil creation:
    * It's creating a veil to hide the start scene. The veil is just a black square 
    * with the size of the window and an alpha != 1 so you can still see the game scene.
    */
    const veil = new PIXI.Graphics()
    .beginFill(0x00000, 0.60)
    .drawRect(0, 0, app.screen.width, app.screen.height)
    .endFill();

    /*
    * CTA creation:
    * It's creating a red rectangle at the top of the screen used as a call to action.
    * It uses the offial 'Dark Netflix Red' color: #B20710.
    */
    const callToAction = new PIXI.Graphics()
    .beginFill(0xB20710)
    .drawRect(0, ctaHeight, app.screen.width, app.screen.height)
    .endFill();

    /*
    * textTutorial creation:
    * Creating a new text object with the text "Swipe to move !".
    * The style is defined by an anonymous PIXI.TextStyle.
    */
    const textTutorial = new PIXI.Text('Swipe to move !', new PIXI.TextStyle({
        fontFamily: 'Arial', // TODO: CHANGE IT
        fontSize: 40,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
    }));

    /*
    * textTutorial Styling:
    * Center the text horizontally and give textTutorial a height of 3/4 of the screen size
    */
    textTutorial.x = (app.screen.width / 2) - (textTutorial.width / 2);
    textTutorial.y = app.screen.height / 2;

    /*
    * Arrows creation:
    * Creating two new text objects, each one displaying an arrow.
    * The style is defined by a PIXI.TextStyle named 'styleArrow'
    * and is centered by the textTutorial object.
    */
    const styleArrow = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 80,
        fill: '#ffffff',
    });

    const leftArrow = new PIXI.Text('<', styleArrow);
    const rightArrow = new PIXI.Text('>', styleArrow);

    /* Arrows styling:
    * Adjusting the arrows with textTutorial's width.
    * Right arrow need to substract it's own width so it doesn't appear after textTutorial.
    * 
    * Both arrows share the same height which is calculated prior to the creation of the arrows.
    */
    leftArrow.x = (app.screen.width / 2) - (textTutorial.width / 2);
    rightArrow.x = (app.screen.width / 2) + ((textTutorial.width / 2) - (rightArrow.width));

    leftArrow.y = arrowHeight; 
    rightArrow.y = arrowHeight;

    /*
    * Glove creation:
    * Create a Glove sprite and scaling it so it can fit the screen.
    * The Glove is also slightly rotated to an angle of '-25°'.
    * 
    * The Glove is centered to the middle of the screen and he share 
    * the height of the arrows with a small step to the bottom of the screen.
    */
    const glove = PIXI.Sprite.from('assets/gant.png');
    glove.scale.set(gloveScale);
    glove.angle = gloveAngle;


    glove.x = (app.screen.width / 2) - (glove.width / 2);
    glove.y = arrowHeight + gloveHeightStep;

    /*
    * Plane creation:
    * Create a Plane sprite and scaling it so it can fit the screen.
    * The Plane's center is also anchored into the middle of it's own texture.
    * 
    * The Plane is centered to the middle of the screen and he share 
    * the height of the CTA with a small step to the bottom of the screen.
    */
    const plane = PIXI.Sprite.from('assets/plane.png');
    plane.anchor.set(0.5);
    plane.scale.set(planeScale);

    plane.x = (app.screen.width / 2) - (plane.width / 2);
    plane.y = ctaHeight - planeStep;

    /*
    * Download Logo creation:
    * Create a Dowload Logo sprite and scaling it so it can fit the screen.
    * The Download Logo's center is also anchored into the middle of it's own texture.
    * 
    * The Download Logo is centered to the middle of the screen and he share 
    * the height of 1/3 the size of the screen.
    */
    const downloadLogo = PIXI.Sprite.from('assets/downloadLogo.png');
    downloadLogo.anchor.set(0.5);
    downloadLogo.scale.set(downloadLogoScale);
    
    downloadLogo.x = (app.screen.width / 2) - (downloadLogo.width / 2);
    downloadLogo.y = app.screen.height / 3;

    /*
    * App Ticker:
    * The ticker manages all the events that occurs every tick (~ frame).
    */
    app.ticker.add(() => {
        /* Make background travel on loop */
        background.tilePosition.y += backgroundSpeed;

        /* When we're in the start scene */
        if (startScene) {
            /* We're checking if the hand is out of the screen. */
            if (glove.x > (rightArrow.x - rightArrow.width) || glove.x < (leftArrow.x - leftArrow.width + 20)) {
                gloveSpeed *= -1; // Inverse speed so the glove can go both directions
            }

            /* It's moving the hand */
            glove.x += gloveSpeed;

            /* It's making the text animates */
            textTutorial.style.fontSize += gloveSpeed * 0.1;
            textTutorial.x = (app.screen.width / 2) - (textTutorial.width / 2);
        }

        /* When we're in the game scene (so we are neither in the start nor end scene) */
        if (!startScene && !endScene) {
            /* It's checking if the user is touching the screen. */
            if (isDown) {
                if (plane.x > userX) {
                    plane.x -= planeSpeed;
                }
                else if (plane.x < userX) {
                    plane.x += planeSpeed;
                }
            }
        }

        /* When we're in the end scene */
        if (endScene) {
            /* It's checking if the downloadLogo is at the max angle. If it is, it's inverting the angle. */
            if (downloadLogo.angle > downloadLogoMaxAngle || downloadLogo.angle < - downloadLogoMaxAngle) {
                downloadLogoAngle *= -1;
            }

            /* It's making the downloadLogo rotate. */
            downloadLogo.angle += downloadLogoAngle;    
        }
    });

    /*
    * EventListener handling:
    * Make 'mousedown | mouseup' and 'touchstart | touchend' trigger events.
    */
    /* It's adding an event listener which handle the game scene start */
    ['mousedown', 'touchstart'].forEach(event =>
        document.querySelector('canvas').addEventListener(event, () => {
            if (startScene) {
                /* Init userX to the listener's x position */

                /* It's removing the elements of the start scene. */
                app.stage.removeChild(glove);
                app.stage.removeChild(rightArrow);
                app.stage.removeChild(leftArrow);
                app.stage.removeChild(textTutorial);

                /* It's setting the startScene variable to false so the game can start */
                startScene = false;

                /* It's removing the call to action after 10 seconds and add the veil to the scene */
                setTimeout(() => {
                    app.stage.removeChild(callToAction);
                    app.stage.addChild(veil);
                    app.stage.addChild(downloadLogo);
                    endScene = true;
                }, (10 * 1000));

                /* It's setting the userX variable to the x position of the mouse or the touch. */
                onmousedown = (event) => userX = event.x;
                onmousemove = (event) => userX = event.x;

                ontouchstart = (event) => userX = event.x;
                ontouchmove = (event) => userX = event.x;
            }

            /* It's setting the isDown variable to true */
            isDown = true;
        }));

    /* It's adding an event listener to the canvas */
    ['mouseup', 'touchend'].forEach(event =>
        /* It's setting the isDown variable to false. */
        document.querySelector('canvas').addEventListener(event, () => {
            isDown = false;
        }));

    /*
    * Stage creation:
    * Adding all the Pixi.js objects onto the scene.
    * 
    * The first object to be added to the scene will be on the back.
    * The last object to be added will be on front of the screen.
    */
    /* It's adding the background to the stage. */
    app.stage.addChild(background);

    /* It's adding the back elements of the start scene to the stage. */
    if (startScene) {
        app.stage.addChild(leftArrow);
        app.stage.addChild(rightArrow);
    }

    /* It's adding the plane to the stage. */
    app.stage.addChild(plane);

    /* It's adding the front elements of the start scene to the stage. */
    if (startScene) {
        app.stage.addChild(textTutorial);
        app.stage.addChild(glove);
    }

    /* CTA is always last to appear */
    app.stage.addChild(callToAction);
}

/*
* Main Scope:
* Create a PIXI application, make the app re-display everything when the window is resized.
* Create Canvas and make it absolute and display the playable ads.
*/
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: true,
});

/* Optionnal: Make the app responsive */
window.addEventListener("resize", () => {
    display()
})

/* Setting the position of the canvas to absolute. */
app.renderer.view.style.position = 'absolute';

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);

/* It's calling the display function. */
display();
