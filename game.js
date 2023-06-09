/* All the scenes booleans */
let startScene = true;
let endScene = false;
let isDown = false;
let tick = 0;

/* This var is used to stock the position of the player's mouse / touch */
let userX = 0;

function checkCollision(missil, poster) {
    return (
        (missil.y < (poster.y + poster.height)) && (((missil.x < (poster.x + poster.width)) && (missil.x > poster.x)) || ((missil.x + missil.width) < (poster.x + poster.width) && ((missil.x + missil.width) > poster.x)))
    );
}

function changeEndScene() {
    credits = new PIXI.TilingSprite(
        PIXI.Texture.from('/assets/credits.png'),
        app.screen.width * 7,
        492,
    );

    credits.x = 0;
    credits.y = app.screen.height - (492 * 0.25);
    credits.scale.set(0.25);

    /* Removing the call to action and the download button from the stage. */
    app.stage.removeChild(downloadButton);
    app.stage.removeChild(logo);
    app.stage.removeChild(poster);
    app.stage.removeChild(callToAction);

    /* Adding the veil and the download logo to the stage. */
    app.stage.addChild(veil);
    app.stage.addChild(downloadLogo);
    app.stage.addChild(logoApp);
    app.stage.addChild(credits);

    /* Removing all the missils from the stage. */
    missilsObject.forEach(function (missil) {
        app.stage.removeChild(missil);
    });

    /* Setting the endScene variable to true. */
    endScene = true;
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

// /* Optionnal: Make the app truly responsive */
// window.addEventListener("resize", () => {
//     display()
// })

/* Setting the position of the canvas to absolute. */
app.renderer.view.style.position = 'absolute';

/* Adding the canvas to the body of the HTML document. */
document.body.appendChild(app.view);

/*
* (OPTIONNAL) Initialization:
* Make Canvas size as same as window's size to allow the app to be 'responsive'
*/
// app.renderer.resize(window.innerWidth, window.innerHeight);

/* Sound initialize */
const cashMp3 = PIXI.sound.Sound.from({ url: '/sounds/cash.mp3', preload: true, volume: 0.35 });

/* Play Theme sound */
PIXI.sound.Sound.from({ url: '/sounds/theme.mp3', preload: true, volume: 0.75 }).play();

/*
* Parameters and Variables:
* Those variables are used in the code to build and display most of the game.
* 
* The values had been put in variables since they're used multiple times and
* it allows the devs to change the vars if needed to polish the display. 
*/
// Background Parameters
const backgroundSpeed = 2;
const backgroundScale = app.screen.width / (1100);

// Call To Action Parameters
const ctaHeight = app.screen.height - 75;

// Arrows Parameters
const arrowHeight = ctaHeight - 45;
const arrowAnchor = 0.5;

// Glove Parameters
const gloveScale = 0.2;
const gloveAngle = -35;
const gloveHeightStep = 20;
let gloveSpeed = 1.5;

// Plane Parameters
const planeScale = 0.275; 25
const planeStep = 145;
const planeSpeed = 5;
const planeAnchor = 0.5;

// Download logo Parameters
const downloadLogoScale = 0.5;
const downloadLogoMaxAngle = 15;
const downloadLogoAnchor = 0.5;
let downloadLogoAngle = 0.5;

// Download logo Parameters
const logoAppScale = 0.5;
const logoAppAnchor = 0.5;

// Download Button Parameters
const downloadButtonScale = 0.25;
const downloadButtonAnchor = 0.5;
const downloadButtonHeight = ctaHeight + 25;
const downloadButtonOffset = app.screen.width - 70;

// Download Button Parameters
const logoScale = 0.35;
const logoAnchor = 0.5;
const logoHeight = ctaHeight + 40;
const logoOffset = 95;

// Missil / MissilObject Parameters
const missilsObject = [];
const missilScale = 0.13;
const missilAnchor = 1.493; // 49.3 Pour bien être au centre mais un peu à droite quand même
const missilSpeed = 3;

// Poster
const postersAsset = [
    '/assets/season1.png',
    '/assets/season2.png',
    '/assets/season3.png',
    '/assets/season4.png',
    null
];
let posterIndex = 0;
let noPoster = false;

const posterInitSpeed = 1.5;
let posterSpeed = posterInitSpeed;

const posterInitHP = 2;
let posterHP = posterInitHP;

/*
* Background creation:
* Create a tiling sprite using a background texture and the screen's width and height.
* In WebGL the image size should preferably be a power of two.
*/
const background = new PIXI.TilingSprite(
    PIXI.Texture.from('/assets/background.png'),
    app.screen.width / backgroundScale, // TODO - /!\ NOT CLEAN
    app.screen.height / backgroundScale, // TODO - /!\ NOT CLEAN
);

background.scale.set(backgroundScale);
background.alpha = (0.55);

let credits = null;
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
const callToAction = new PIXI.TilingSprite(
    PIXI.Texture.from('/assets/cta.png'),
    app.screen.width * 1.5,
    app.screen.height,
);

callToAction.x = 0;
callToAction.y = ctaHeight;
callToAction.scale.set(0.7);
/*
* textTutorial creation:
* Creating a new text object with the text "Swipe to move !".
* The style is defined by an anonymous PIXI.TextStyle.
*/
const textTutorial = new PIXI.Text('Swipe to move !', new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 45,
    fontWeight: 'bold',
    fill: '#e50914',
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
* ...
*/
const arrow = PIXI.Sprite.from('/assets/swipe.png');
arrow.anchor.set(arrowAnchor);
arrow.scale.set(0.5);
arrow.x = (app.screen.width / 2);
arrow.y = arrowHeight;

/*
* Glove creation:
* Create a Glove sprite and scaling it so it can fit the screen.
* The Glove is also slightly rotated to an angle of '-25°'.0.5
* 
* The Glove is centered to the middle of the screen and he share 
* the height of the arrows with a small step to the bottom of the screen.
*/
const glove = PIXI.Sprite.from('/assets/glove.png');
glove.scale.set(gloveScale);
glove.angle = gloveAngle;

glove.x = arrow.x;
glove.y = arrowHeight - gloveHeightStep;

/*
* Plane creation:
* Create a Plane sprite and scaling it so it can fit the screen.
* The Plane's center is also anchored into the middle of it's own texture.
* 
* The Plane is centered to the middle of the screen and he share 
* the height of the CTA with a small step to the bottom of the screen.
*/
const plane = PIXI.Sprite.from('/assets/plane.png');
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
const downloadLogo = PIXI.Sprite.from('/assets/downloadLogo.png');
downloadLogo.anchor.set(downloadLogoAnchor);
downloadLogo.scale.set(downloadLogoScale);

downloadLogo.x = (app.screen.width / 2) - (downloadLogo.width / 2);
downloadLogo.y = app.screen.height / 3 - 50;


const logoApp = PIXI.Sprite.from('/assets/logoApp.png');
logoApp.anchor.set(logoAppAnchor);
logoApp.scale.set(logoAppScale);

logoApp.x = (app.screen.width / 2) - (logoApp.width / 2);
logoApp.y = app.screen.height * (2 / 3) - 50;
/*
* Download Button creation:
* Create a Download Button sprite and scaling it so it can fit the screen.
* The Download Button's center is also anchored into the middle of it's own texture.
* 
* The Download Button is centered to the middle of the screen and he share 
* the height of the CTA.
*/
const downloadButton = PIXI.Sprite.from('/assets/downloadButton.png');
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
const logo = PIXI.Sprite.from('/assets/logo.png');
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
poster.scale.set(0.25);

poster.x = (app.screen.width / 2) - (poster.width / 2);
poster.y = app.screen.height / 4;

/* Making the CTA interactive. When the user clicks on an element of the CTA the user is redirected to the Netflix website. */
[downloadButton, logo, downloadLogo, veil].forEach(element => {
    element.eventMode = 'static';
    element.on('pointerdown', () => {
        location.href = 'https://www.netflix.com/title/80057281';
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
        if (glove.x < (arrow.x - (arrow.width / 2) - (glove.width / 2)) || glove.x > (arrow.x + glove.width / 2)) {
            gloveSpeed *= -1; // Inverse speed so the glove can go both directions
        }

        /* It's moving the hand */
        glove.x += gloveSpeed;

        /* It's making the text animates */
        textTutorial.style.fontSize += gloveSpeed * 0.025;
        textTutorial.x = (app.screen.width / 2) - (textTutorial.width / 2);
    }

    /* When we're in the game scene (so we are neither in the start nor end scene) */
    if (!startScene && !endScene) {
        if (poster.x > app.screen.width || poster.x < 0) {
            posterSpeed *= -1;
        }

        /* It's moving the hand */
        poster.x += posterSpeed;

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
        if (tick % 100 == 0) {
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
            if (missil.y + missil.height < 0) {
                app.stage.removeChild(missil);
            }

            /* Checking if the missil collides with the poster and if it does, it removes the missil from the stage and removes it from the missilsObject array. */
            if (checkCollision(missil, poster) && !noPoster) {
                cashMp3.play();
                posterSpeed *= 1.075;
                posterHP -= 1;

                app.stage.removeChild(missil);
                const index = missilsObject.indexOf(missil);
                missilsObject.splice(index, 1);

                if (posterHP == 0) {
                    /* Increments the posterIndex and if there is a poster in the postersAsset array at the posterIndex, it sets the poster texture to the next poster in the array. */
                    posterIndex += 1;

                    /* Setting the HP and speed of the poster to the initial values plus the index of the poster. */
                    posterHP = posterInitHP + posterIndex;
                    posterSpeed = posterInitSpeed + posterIndex;

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
            }
        });

        if (noPoster && !endScene) {
            changeEndScene();
        }
    }

    /* When we're in the end scene */
    if (endScene) {
        /* It's checking if the downloadLogo is at the max angle. If it is, it's inverting the angle. */
        if (downloadLogo.angle > downloadLogoMaxAngle || downloadLogo.angle < -downloadLogoMaxAngle) {
            downloadLogoAngle *= -1;
        }

        /* It's making the downloadLogo rotate. */
        downloadLogo.angle += downloadLogoAngle;

        if (credits) {
            credits.tilePosition.x += backgroundSpeed * 2;
        }
    }

    /* Make background travel on loop */
    background.tilePosition.y += backgroundSpeed;
    callToAction.tilePosition.x += backgroundSpeed * 2;

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
        app.stage.removeChild(arrow);
        app.stage.removeChild(textTutorial);

        app.stage.addChild(poster);

        /* It's setting the startScene variable to false so the game can start */
        startScene = false;

        /* It's removing the call to action after 10 seconds and add the veil to the scene */
        setTimeout(() => {
            if (!endScene) {
                changeEndScene();
            }
        }, (15 * 1000));

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
app.stage.addChild(arrow);

/* It's adding the plane to the stage. */
app.stage.addChild(plane);

/* It's adding the front elements of the start scene to the stage. */
app.stage.addChild(textTutorial);
app.stage.addChild(glove);


/* CTA is always last to appear */
app.stage.addChild(callToAction);
app.stage.addChild(downloadButton);
app.stage.addChild(logo);
