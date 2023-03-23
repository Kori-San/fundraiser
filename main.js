/* All the scenes booleans */
let startScene = true;
let endScene = false;
let isDown = false;
let tick = 0;

/* This var is used to stock the position of the player's mouse / touch */
let userX = 0;

function checkCollision(missil, poster) {
    return (
        (missil.y < poster.y + poster.height)
        &&
        (
            (missil.x < poster.x + poster.width && missil.x > poster.x)
            ||
            (missil.x + missil.width < poster.x + poster.width && missil.x + missil.width > poster.x)
        )
    );
}

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
    const planeAnchor = 0.5;

    // Download logo Parameters
    const downloadLogoScale = 0.35;
    const downloadLogoMaxAngle = 15;
    const downloadLogoAnchor = 0.5;
    let downloadLogoAngle = 0.5;

    // Download Button Parameters
    const downloadButtonScale = 0.175;
    const downloadButtonAnchor = 0.5;
    const downloadButtonHeight = ctaHeight + 30;
    const downloadButtonOffset = app.screen.width - 90;

    // Download Button Parameters
    const logoScale = 0.175;
    const logoAnchor = 0.5;
    const logoHeight = ctaHeight + 30;
    const logoOffset = 90;

    // Missil / MissilObject Parameters
    const missilsObject = [];
    const missilScale = 0.075;
    const missilAnchor = 1.493; // 49.3 Pour bien être au centre mais un peu à droite quand même
    const missilSpeed = 3;

    // Poster
    const postersAsset = [
        'assets/gant.png',
        'assets/plane.png',
        null
    ];
    let posterIndex = 0;
    let noPoster = false;

    /*
    * Background creation:
    * Create a tiling sprite using a background texture and the screen's width and height.
    * In WebGL the image size should preferably be a power of two.
    */
    const background = new PIXI.TilingSprite(
        PIXI.Texture.from('/assets/background.png'),
        1920, // TODO - /!\ NOT CLEAN
        982, // TODO - /!\ NOT CLEAN
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
    * The Glove is also slightly rotated to an angle of '-25°'.0.5
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
    plane.anchor.set(planeAnchor);
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
    downloadLogo.anchor.set(downloadLogoAnchor);
    downloadLogo.scale.set(downloadLogoScale);

    downloadLogo.x = (app.screen.width / 2) - (downloadLogo.width / 2);
    downloadLogo.y = app.screen.height / 3;

    /*
    * Download Button creation:
    * Create a Download Button sprite and scaling it so it can fit the screen.
    * The Download Button's center is also anchored into the middle of it's own texture.
    * 
    * The Download Button is centered to the middle of the screen and he share 
    * the height of the CTA.
    */
    const downloadButton = PIXI.Sprite.from('assets/downloadButton.png');
    downloadButton.anchor.set(downloadButtonAnchor);
    downloadButton.scale.set(downloadButtonScale);

    downloadButton.x = downloadButtonOffset;
    downloadButton.y = downloadButtonHeight;

    /*
    * Logo creation:
    * Create a Logo and scaling it so it can fit the screen.
    * The Download Butotn's center is also anchored into the middle of it's own texture.
    * 
    * The Download Button is centered to the middle of the screen and he share 
    * the height of the CTA.
    */
    const logo = PIXI.Sprite.from('assets/logo.png');
    logo.anchor.set(logoAnchor);
    logo.scale.set(logoScale);

    logo.x = logoOffset;
    logo.y = logoHeight;

    /*
    * Poster creation:
    * Create a Poster sprite and scaling it so it can fit the screen.
    * The Poster's center is also anchored into the middle of it's own texture.
    * 
    * The Poster is centered to the middle of the screen and he share 
    * the height of 1/3 the size of the screen.
    */
    let poster = PIXI.Sprite.from(postersAsset[posterIndex]);
    poster.anchor.set(0.5);
    poster.scale.set(0.075);

    poster.x = (app.screen.width / 2) - (poster.width / 2);
    poster.y = app.screen.height / 3;

    /* Making the CTA interactive. When the user clicks on an element of the CTA the user is redirected to the Netflix website. */
    [downloadButton, logo, downloadLogo, veil].forEach(element => {
        element.eventMode = 'static';
        element.on('pointerdown', () => {
            location.href = 'https://www.netflix.com/';
        })
    });

    /*
    * App Ticker:
    * The ticker manages all the events that occurs every tick (~ frame).
    */
    app.ticker.add(() => {
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
                if (plane.x >= userX + planeSpeed) {
                    plane.x -= planeSpeed;
                }
                else if (plane.x <= userX - planeSpeed) {
                    plane.x += planeSpeed;
                }
            }

            /* Creating a new missil every 50 ticks. */
            if (tick % 50 == 0) {
                /* Creating a missil and give it an id of tick divided by 50 (1, 2, 3, 4, etc...). */
                const missil = PIXI.Sprite.from('/assets/missil.png');
                missil.id = tick / 50;

                /* It's setting the scale and the anchor of the missil. */
                missil.scale.set(missilScale);
                missil.anchor.set(missilAnchor);

                /* It's setting the missil's position to the middle of the plane. */
                missil.x = (plane.x + (plane.width / 2));
                missil.y = (plane.y);

                /* Pushing the missil into the object's list and adding it to the stage. */
                missilsObject.push(missil);
                app.stage.addChild(missil);
            }

            /* The above code is checking if the missil has hit the poster. If it has, it will remove the missil and change the poster to the next poster in the array. */
            missilsObject.forEach(function (missil) {
                /* Moving the missil up the screen. */
                missil.y -= missilSpeed;

                /* Removing the missil from the stage when it goes off the top of the screen. */
                if (missil.y < 0) {
                    app.stage.removeChild(missil);
                }

                /* Checking if the missil collides with the poster and if it does, it removes the missil from the stage and removes it from the missilsObject array. */
                if (checkCollision(missil, poster) && !noPoster) {
                    app.stage.removeChild(missil);
                    const index = missilsObject.indexOf(missil);
                    const x = missilsObject.splice(index, 1);

                    /* Increments the posterIndex and if there is a poster in the postersAsset array at the posterIndex, it sets the poster texture to the next poster in the array. */
                    posterIndex += 1;

                    if (postersAsset[posterIndex] != null) {
                        let nextTexture = PIXI.Texture.from(postersAsset[posterIndex]);
                        poster.texture = nextTexture
                    }
                    /* If there is no poster in the postersAsset array at the posterIndex, it sets the noPoster variable to true and removes the poster from the stage. */
                    else {
                        noPoster = true;
                        app.stage.removeChild(poster);
                    }
                }
            });
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

        /* Make background travel on loop */
        background.tilePosition.y += backgroundSpeed;

        /* It's incrementing the tick variable by 1. */
        tick += 1;
    });

    /*
    * EventListener handling:
    * Make 'pointerup' and 'pointerdown' trigger events.
    */
    document.querySelector('canvas').addEventListener('pointerdown', () => {
        /* It's handling the game scene start */
        if (startScene) {
            /* It's removing the elements of the start scene. */
            app.stage.removeChild(glove);
            app.stage.removeChild(rightArrow);
            app.stage.removeChild(leftArrow);
            app.stage.removeChild(textTutorial);

            app.stage.addChild(poster);

            /* It's setting the startScene variable to false so the game can start */
            startScene = false;

            /* It's removing the call to action after 10 seconds and add the veil to the scene */
            setTimeout(() => {
                /* Removing the call to action and the download button from the stage. */
                app.stage.removeChild(callToAction);
                app.stage.removeChild(downloadButton);
                app.stage.removeChild(logo);

                /* Adding the veil and the download logo to the stage. */
                app.stage.addChild(veil);
                app.stage.addChild(downloadLogo);

                /* Removing all the missils from the stage. */
                missilsObject.forEach(function (missil) {
                    app.stage.removeChild(missil);
                });

                /* Setting the endScene variable to true. */
                endScene = true;
            }, (10 * 1000));

            /* It's setting the userX variable to the x position of the mouse or the touch. */
            onpointerdown = (event) => { userX = event.x; };
            onpointermove = (event) => { userX = event.x; };
        }

        /* It's setting the isDown variable to true */
        isDown = true;
    });

    /* It's adding an event listener to the canvas */
    document.querySelector('canvas').addEventListener('pointerup', () => {
        /* It's setting the isDown variable to false. */
        isDown = false;
    });

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
    app.stage.addChild(downloadButton);
    app.stage.addChild(logo);

    if (endScene) {
        app.stage.addChild(veil);
        app.stage.addChild(downloadLogo);
    }
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

/* Optionnal: Make the app truly responsive */
window.addEventListener("resize", () => {
    display()
})

/* Setting the position of the canvas to absolute. */
app.renderer.view.style.position = 'absolute';

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);

/* It's calling the display function. */
display();
