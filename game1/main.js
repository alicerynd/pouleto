// ------------------------- VARIABLES -------------------------

// FIELD

const content = document.getElementById("content"); //used for loader, contains header and field
const field = document.getElementById("field");

// HTML BLOCS FOR GAME STATUS

const loading = document.getElementById("loading");
const intro = document.getElementById("intro"); 
const lost = document.getElementById("lost");
const won = document.getElementById("won");
const restartButton = document.getElementById("restartButton");

// const pause = document.getElementById("pause");
// const pauseButton = document.getElementById("pauseButton");

// POULETO

const pouleto = document.getElementById("pouleto");
let pouleto_left = 20; 
let pouleto_top = 20; 
    pouleto.style.left = pouleto_left + "px";
    pouleto.style.top = pouleto_top + "px";

// SCORE

let score = 0; //set initial score
const scoreWon = 50; //set score you need to win a game
const displayScore = document.getElementById("score"); //displays score during the game
const displayScoreEndWin = document.getElementById("displayScoreEndWin"); //displays score when you win
const displayFinalTime = document.getElementById("displayFinalTime");
const scoreWonIntro = document.getElementById("scoreWon"); 
    scoreWonIntro.innerHTML = scoreWon; //displays score to reach in the intro bloc

// TIMER

let gameTimer = new Timer();
document.getElementById("timer").innerHTML = "00:00:00";

// LIVES

const pouletoLives = 3; //set initial number of lives
let currentPouletoLives; //contains current number of lives
const pouletoLivesDisplay = document.getElementById("pouletoLivesDisplay"); //Score mynavbar display

// MISC

const Xcoordinates = [20, 120, 220, 320, 420, 520, 620, 720, 820, 920, 1020]; //possible horizontal positions
const Ycoordinates = [20, 120, 220, 320, 420]; //possible vertical positions

// SEEDS

let seedId = 1; //setting first seed id
let seedLifetime; //time before any seed disappears

const seedTypes = ["normal", "golden", "super"]

let normalSeedInterval; //seed generator interval
let normalSeedDelay = 1000; //time before new normal seed appears
let normalSeedLifetime = 4000; //time before normal seed disappears 

let goldenSeedInterval; 
let goldenSeedDelay = 6200; 
let goldenSeedLifetime = 2100;

let superSeedInterval; 
let superSeedDelay = 20000; 
let superSeedLifetime = 1200;

let allSeeds = []; //array which contains all the seeds on the field

// WOLF

let wolf; //wolf object
let wolfInterval; //wolf generator interval
let wolfDelay = 7800; //time between 2 wolves
let wolfMovesInterval; //wolf movement generator interval
let wolfNumberMoves = 8; //setting number of moves wolf has to make in a lifetime
let wolfLifetime = 4000; //time before wolf disappears
let wolfTimeout; //wolf's timout using wolfLifetime

// TRACTOR

let tractor;
let tractorDirection = ["left", "right"]; //possible directions of the tractor
let tractorInterval; //tractor generator interval
let tractorDelay = 11000; //time between 2 tractors
let tractorMovesInterval; //tractor movement generator interval
let tractorNumberMoves = 13; //setting number of moves tractor has to make to cross field
let tractorSpeed = 500; //setting time tractor needs for one move
let tractorLifetime = tractorSpeed * tractorNumberMoves; //time before wolf disappears
let tractorTimeout; //tractor's timeout, using tractorLifetime

// NEW LIVES

let life = null;
let lifeInterval; //new lives generator interval
let lifeDelay = 10000; //time between 2 new lives
let lifeLifetime = 2000; //time before new life disappears
let lifeTimeout; //new life's timout, using lifeLifetime


// ------------------------- SEEDS MANAGER -------------------------


class Seed 
{
    constructor(id, seedType) 
    {
        this.htmlElement = document.createElement("div");
        this.htmlElement.id = id;
        this.htmlElement.className = "seed " + seedType;
        this.left = Xcoordinates[Math.floor(Math.random() * Xcoordinates.length)];
        this.top = Ycoordinates[Math.floor(Math.random() * Ycoordinates.length)];
        this.htmlElement.style.left = this.left + "px";
        this.htmlElement.style.top = this.top + "px";
        
        this.lock = false;
     
        if (seedType == "normalSeed")
        {
            this.scoreValue = 1;
            this.soundToPlay = new Audio('../sounds/normalSeedSound.mp3');
        }
        else if (seedType == "goldenSeed") 
        {
            this.scoreValue = 5;
            this.soundToPlay = new Audio('../sounds/goldenSeedSound.mp3');
            
            this.afterElement = document.createElement("div");
            this.afterElement.className = "plusFive";
            this.afterElement.timeout = 1200;
            this.afterElement.style.left = this.left + "px";
            this.afterElement.style.top = this.top + "px";
        }
        else if (seedType == "superSeed") 
        {
            this.scoreValue = 10;
            this.soundToPlay = new Audio('../sounds/goldenSeedSound.mp3');
            
            this.afterElement = document.createElement("div");
            this.afterElement.className = "plusTen";
            this.afterElement.timeout = 1200;
            this.afterElement.style.left = this.left + "px";
            this.afterElement.style.top = this.top + "px";
        }
     
        this.seedTimeout = null;
    }
}

function newSeed(seedType)
{
    let newSeed = new Seed("seed" + seedId, seedType);
    let tryNewSeed = false;

    while (!tryNewSeed) 
    {
        //looking in the seed array if there is an existing seed with the new seed coordinates   
        let verifySeeds = allSeeds.find((existingSeed) => newSeed.top === existingSeed.top && newSeed.left === existingSeed.left);
        {
            //if the seed appeared on an already existing seed or on pouleto
            if (verifySeeds != undefined || pouleto_top === newSeed.top && pouleto_left === newSeed.left)
            {
                console.log("A seed appeared on an already existing seed or on pouleto")
                tryNewSeed = false;
                newSeed = new Seed("seed" + seedId, seedType);
            }
            else 
            {
                tryNewSeed = true;
            }
        }
    }   

    field.appendChild(newSeed.htmlElement);
    allSeeds.push(newSeed);

    if (seedType == "normalSeed")
    {seedLifetime = normalSeedLifetime;}

    if (seedType == "goldenSeed")
    {seedLifetime = goldenSeedLifetime;}

    newSeed.seedTimeout = setTimeout(function()
    { 
        if (!newSeed.lock)
        {
            newSeed.lock = true;
            field.removeChild(newSeed.htmlElement);
            allSeeds.splice(newSeed, 1);
            newSeed = undefined;
        }
    }, seedLifetime);

    seedId = seedId +1; //incrementing id for next seed

    hitSeed(); // checking if the new seed appeared on pouleto
}

function hitSeed()
{
    //looking for a seed that would be in the same place as pouleto
    const seedToRemove = allSeeds.find((seed) => pouleto_top === seed.top && pouleto_left === seed.left); 

    //if there is one and it is not locked, remove it
    if (seedToRemove != undefined && !seedToRemove.lock) 
    {
        seedToRemove.lock = true;
        
        clearTimeout(seedToRemove.seedTimeout);
        const seedToRemoveIndex = allSeeds.findIndex((seed) => pouleto_top === seed.top && pouleto_left === seed.left);
        seedToRemove.soundToPlay.play();
        
        score = score + seedToRemove.scoreValue;
        displayScore.innerHTML = score;

        field.removeChild(seedToRemove.htmlElement);
        allSeeds.splice(seedToRemoveIndex, 1);

        if (seedToRemove.afterElement != undefined)
        {
            field.appendChild(seedToRemove.afterElement);
            seedToRemove.AfterElementTimeout = setTimeout(function()
            { 
                field.removeChild(seedToRemove.afterElement);
            }, seedToRemove.afterElement.timeout);
        }

        if (score >= scoreWon)
        {
            winGame();
        }
    }
} 

// ------------------------- WOLVES -------------------------

class Wolf 
{
    constructor()
    {
        this.htmlElement = document.createElement("div");
        this.htmlElement.id = "wolf";
        this.left = Xcoordinates[Math.floor(Math.random() * Xcoordinates.length)];
        this.top = Ycoordinates[Math.floor(Math.random() * Ycoordinates.length)];
        this.htmlElement.style.left = this.left + "px";
        this.htmlElement.style.top = this.top + "px";
        this.movesDone = 0;
        this.damage = 1;
        this.scoreValue = 5;
        this.soundToPlay = new Audio('../sounds/wolf.mp3'); 

        this.afterElement = document.createElement("div");
        this.afterElement.className = "minusFive";
        this.afterElement.timeout = 1200;
    }
}

function newWolf()
{
    wolf = new Wolf(); 
    let tryNewWolf = false;

    while (!tryNewWolf) //checking if wolf appeared on pouleto
    {
        if (pouleto_top === wolf.top && pouleto_left === wolf.left)
        {
            console.log("Wolf spawned on pouleto")
            tryNewWolf = false;
            wolf = undefined;
            wolf = new Wolf();
        }
        else 
        {
            tryNewWolf = true;
        }
    }
    
    field.appendChild(wolf.htmlElement);
    wolfMovesInterval = setInterval(moveWolf, wolfLifetime / wolfNumberMoves);
    wolfTimeout = setTimeout(function()
    { 
        field.removeChild(wolf.htmlElement);
        clearInterval(wolfMovesInterval);
        wolf = undefined;
    }, wolfLifetime);
}

function hitWolf()
{
    //checking if wolf is here, and if he is on pouetlo
    if (wolf != undefined && pouleto_top === wolf.top && pouleto_left === wolf.left) 
    {
        wolf.soundToPlay.play();
        
        score = score - wolf.scoreValue;
        displayScore.innerHTML = score;

        pouletoHurt();
        updateLives(currentPouletoLives - wolf.damage)
        
        clearTimeout(wolfTimeout);
        clearInterval(wolfMovesInterval);
        field.removeChild(wolf.htmlElement);
        
        wolf.afterElement.style.left = wolf.left + "px";
        wolf.afterElement.style.top = wolf.top + "px";
        field.appendChild(wolf.afterElement);
        wolfAfterElementTimeout = setTimeout(function()
        { 
            field.removeChild(wolf.afterElement);
            wolf = undefined;
        }, wolf.afterElement.timeout);
    }

    if (currentPouletoLives <= 0)
    {
        looseGame();
    }
}

function moveWolf()
{
    if (wolf != undefined)
    {
        if (wolf.movesDone < wolfNumberMoves - 1)
        {
            let possibleWolfMoves = [];

            if (pouleto_top < wolf.top) // if wolf is under pouleto
            {
                possibleWolfMoves.push("top");
            }
            if (pouleto_top > wolf.top) // if wolf is above pouleto
            {
                possibleWolfMoves.push("bottom");
            }
            if (pouleto_left < wolf.left) // if wolf is on the right side of pouleto
            {
                possibleWolfMoves.push("left");
            }
            if (pouleto_left > wolf.left) // if wolf is on the left side of pouleto
            {
                possibleWolfMoves.push("right");
            }

            let movePicked = possibleWolfMoves[Math.floor(Math.random() * possibleWolfMoves.length)];
        
            switch (movePicked)
            {
                case "top":
                    wolf.top = wolf.top - 100;
                    wolf.htmlElement.style.top = wolf.top + "px";
                    break;
                case "bottom":
                    wolf.top = wolf.top + 100;
                    wolf.htmlElement.style.top = wolf.top + "px";
                    break;
                case "left":
                    wolf.left = wolf.left - 100; 
                    wolf.htmlElement.style.left = wolf.left + "px";
                    break;
                case "right":
                    wolf.left = wolf.left + 100; 
                    wolf.htmlElement.style.left = wolf.left + "px";
                    break;
                default:
                    console.log("No moves could be made")
            }
            wolf.movesDone++;

            hitWolf();
        }
        else
        {
            clearInterval(wolfMovesInterval);
        }
    }
}

// ------------------------- TRACTOR -------------------------

class Tractor 
{
    constructor()
    {
        this.direction = tractorDirection[Math.floor(Math.random() * tractorDirection.length)];
        this.htmlElement = document.createElement("div");
        this.htmlElement.id = "tractor";
        this.htmlElement.innerHTML = '<img style="width: 150px;" src="../images/tractor_'+this.direction+'.gif" />';
        
        this.soundToPlay1 = new Audio('../sounds/chickenscream.mp3'); 
        this.soundToPlay2 = new Audio('../sounds/chickenscream.mp3'); 

        if (this.direction == "right")
        {
            this.left = -80;
            this.htmlElement.style.left = (this.left - 50) + "px";
        }
        else if (this.direction == "left")
        {
            this.left = 1120;
            this.htmlElement.style.left = (this.left + 50) + "px";
        }
        
        this.top = Ycoordinates[Math.floor(Math.random() * Ycoordinates.length)];
        this.htmlElement.style.top = this.top + "px";
        this.movesDone = 0;
        this.damage = 1;
        this.scoreValue = 5;

        this.afterElement = document.createElement("div");
        this.afterElement.className = "minusFive";
        this.afterElement.timeout = 1200;        
    }
}

function newTractor()
{
    tractor = new Tractor();
    let tryTractor = false;

    while (!tryTractor) //checking if wolf appeared on pouleto
    {
        if ((pouleto_left == 20 || pouleto_left == 1020) && pouleto_top === tractor.top)
        {
            console.log("Tractor spawned on pouleto")
            tryTractor = false;
            tractor = undefined;
            tractor = new Tractor();
        }
        else
        {
            tryTractor = true;
        }
    }
    
    //tractor.soundToPlay1.play();

    field.appendChild(tractor.htmlElement);
    tractorMovesInterval = setInterval(moveTractor, tractorSpeed);
    tractorTimeout = setTimeout(function()
    {
        field.removeChild(tractor.htmlElement);
        clearInterval(tractorMovesInterval);
        tractor = undefined;
    }, tractorLifetime);
}   

function hitTractor()
{
    if (tractor != undefined && pouleto_top === tractor.top && pouleto_left === tractor.left) //checking if tractor is here, and if he is on pouetlo
    {
        tractor.soundToPlay2.play();

        score = score - tractor.scoreValue;
        displayScore.innerHTML = score;

        pouletoHurt();
        updateLives(currentPouletoLives - tractor.damage)
        
        clearTimeout(tractorTimeout);
        clearInterval(tractorMovesInterval);
        field.removeChild(tractor.htmlElement);

        tractor.afterElement.style.left = tractor.left + "px";
        tractor.afterElement.style.top = tractor.top + "px";
        field.appendChild(tractor.afterElement);
        tractorAfterElementTimeout = setTimeout(function()
        { 
            field.removeChild(tractor.afterElement);
            tractor = undefined;
        }, tractor.afterElement.timeout);

        if (currentPouletoLives <= 0)
        {
            looseGame();
        }
    }
}

function moveTractor()
{
    if (tractor != undefined)
    {
        if (tractor.movesDone < tractorNumberMoves)
        {
            if (tractor.direction == "right")
            {
                tractor.left = tractor.left + 100;
                tractor.htmlElement.style.left = (tractor.left + 50) + "px";
            }
            else if (tractor.direction == "left")
            {
                tractor.left = tractor.left - 100;
                tractor.htmlElement.style.left = (tractor.left - 50) + "px";
            }
            tractor.movesDone++;
            hitTractor();
        }
        else
        {
            clearInterval(tractorMovesInterval);
        }
    }
}

// ------------------------- LIFE SPAWN -------------------------

class Life 
{
    constructor()
    {
        this.htmlElement = document.createElement("div");
        this.htmlElement.id = "life";
        this.htmlElement.className = "newLife";
        this.left = Xcoordinates[Math.floor(Math.random() * Xcoordinates.length)];
        this.top = Ycoordinates[Math.floor(Math.random() * Ycoordinates.length)];
        this.htmlElement.style.left = this.left + "px";
        this.htmlElement.style.top = this.top + "px";
        this.value = 1;
        this.soundToPlay = new Audio('../sounds/newLife.mp3'); 
    }
}

function newLife()
{
    if (currentPouletoLives < pouletoLives)
    {
        life = new Life();
        
        field.appendChild(life.htmlElement);
        lifeTimeout = setTimeout(function()
        { 
            field.removeChild(life.htmlElement);
            life = null;
        }, lifeLifetime);

        lifeDelay = Math.floor(Math.random() * (20000 - 5000 + 1) + 5000);
    }
}

function hitLife()
{
    if (life != undefined && pouleto_top === life.top && pouleto_left === life.left) 
    {
        life.soundToPlay.play();
        clearTimeout(lifeTimeout);
        field.removeChild(life.htmlElement);
        life = null;
        updateLives(currentPouletoLives + 1);
    }
} 

