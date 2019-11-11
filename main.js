// VARIABLES

const content = document.getElementById("content"); //used for loader, contains header and field
const field = document.getElementById("field");
const pouleto = document.getElementById("pouleto");
let wolf;
let life = null;

const displayScore = document.getElementById("score"); //displays score during the game
const displayScoreLost = document.getElementById("displayScoreLost"); //displays score when you loose
const pouletoLivesDisplay = document.getElementById("pouletoLivesDisplay"); //displays number of lives during the game

const Xcoordinates = [20, 120, 220, 320, 420, 520, 620, 720, 820, 920, 1020]; //possible horizontal positions
const Ycoordinates = [20, 120, 220, 320, 420]; //possible vertical positions

const loading = document.getElementById("loading");
const intro = document.getElementById("intro"); 
const pause = document.getElementById("pause");
const lost = document.getElementById("lost");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

let gameStatus = "gameOn"; //set initial Game Status
let score = 0; //set initial score
let pouletoLives = 3; //set initial number of lives
let currentPouletoLives; //contains current number of lives

//set initial pouleto position :
let pouleto_left = 20; 
let pouleto_top = 20; 
pouleto.style.left = pouleto_left + "px";
pouleto.style.top = pouleto_top + "px";

let seedId = 1; //first seed id
let seedInterval; //new seed interval 
let goldenSeedInterval; //new golden seed interval
let seedDelay = 1000; //time before new normal seed appears
let goldenSeedDelay = 6200; //time before new normal golden seed appears
let seedLifetime; //time before seed dies
let normalSeedLifetime = 4000; //setting normal seed's lifetime 
let goldenSeedLifetime = 2000; //setting golden seed's lifetime 
let allSeeds = []; //array with all the seeds on the field

let wolfInterval; //new wolf interval
let wolfDelay = 7000; //time between 2 wolves
let wolfLifetime = 4000; //setting wolf's lifetime
let wolfTimeout; //timout of the wolf, using wolfLifetime
let wolfMovesInterval; //new wolf movement interval
let wolfNumberMoves = 8; //setting number of moves wolf has to make in a lifetime

let lifeInterval; //new life interval
let lifeDelay = 10000; //time between 2 lives
let lifeLifetime = 2000; //setting life's lifetime
let lifeTimeout; //timout of the life, using lifeLifetime

// ------------------------- SEEDS -------------------------

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
     
        if (seedType == "normal_seed")
        {
            this.scoreValue = 1;
            this.soundToPlay = new Audio('sounds/crunch.mp3');
        }
        else if (seedType == "golden_seed") 
        {
            this.scoreValue = 5;
            this.soundToPlay = new Audio('sounds/golden_seed.mp3');
        }
     
        this.seedTimeout = null;
    }
}

function newSeed(seedType)
{
    const newSeed = new Seed("seed" + seedId, seedType);
    field.appendChild(newSeed.htmlElement);
    allSeeds.push(newSeed);

    if (seedType == "normal_seed")
    {
        seedLifetime = normalSeedLifetime;
    }
    if (seedType == "golden_seed")
    {
        seedLifetime = goldenSeedLifetime;
    }
    newSeed.seedTimeout = setTimeout(function()
    { 
        if (!newSeed.lock)
        {
            newSeed.lock = true;
            field.removeChild(newSeed.htmlElement);
            allSeeds.splice(newSeed, 1);
        }
    }, seedLifetime);

    seedId = seedId +1; //incrementing id for next seed

    hitSeed(); //checking if the new seed appeared on pouleto
}

function hitSeed()
{
    const seedToRemove = allSeeds.find((seed) => pouleto_top === seed.top && pouleto_left === seed.left); //looking for a seed that would be in the same place as pouleto
    if (seedToRemove != undefined && !seedToRemove.lock) //if there is one and it is not locked
    { 
        seedToRemove.lock = true;
        const seedToRemoveIndex = allSeeds.findIndex((seed) => pouleto_top === seed.top && pouleto_left === seed.left); // find seed's index in the array
        seedToRemove.soundToPlay.play();
        
        score = score + seedToRemove.scoreValue;
        displayScore.innerHTML = score;

        clearTimeout(seedToRemove.seedTimeout);
        field.removeChild(seedToRemove.htmlElement);
        allSeeds.splice(seedToRemoveIndex, 1);
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
        this.scoreValue = -1;
        this.damage = 1;
        this.soundToPlay = new Audio('sounds/wolf.mp3'); 
    }
}

function newWolf()
{
    wolf = new Wolf();
    
    field.appendChild(wolf.htmlElement);
    wolfMovesInterval = setInterval(moveWolf, wolfLifetime / wolfNumberMoves);
    wolfTimeout = setTimeout(function()
    { 
        field.removeChild(wolf.htmlElement);
        wolf = undefined;
    }, wolfLifetime);

    let tryNewWolf = hitWolf(); //checking if wolf appeared on pouleto
}

function hitWolf()
{
    if (wolf != undefined && pouleto_top === wolf.top && pouleto_left === wolf.left) //checking if wolf is here, and if he is on pouetlo
    {
        wolf.soundToPlay.play();        
        score = score + wolf.scoreValue;
        displayScore.innerHTML = score;

        if (pouleto.style.backgroundImage == "url(\"images/pouleto_right.png\")")
        {
            pouleto.style.backgroundImage = "url(\"images/pouleto_hurt_right.gif\")";
            document.onkeydown = undefined;
            setTimeout(() =>
            { 
                pouleto.style.backgroundImage = "url(\"images/pouleto_right.png\")";
                document.onkeydown = movePouleto;
            }, 1300);
        }
        else if (pouleto.style.backgroundImage == "url(\"images/pouleto_left.png\")")
        {
            pouleto.style.backgroundImage = "url(\"images/pouleto_hurt_left.gif\")";
            document.onkeydown = undefined;
            setTimeout(() =>
            { 
                pouleto.style.backgroundImage = "url(\"images/pouleto_left.png\")";
                document.onkeydown = movePouleto;
            }, 1300);
        }

        updateLives(currentPouletoLives - wolf.damage)
        
        clearTimeout(wolfTimeout);
        clearInterval(wolfMovesInterval);
        field.removeChild(wolf.htmlElement);
        wolf = undefined;

        if (currentPouletoLives <= 0)
        {
            looseGame();
        }
    }
}

function moveWolf()
{
    if (wolf.movesDone < wolfNumberMoves - 1)
    {
        let possibleWolfMoves = [];
        if (wolf.top > 20)
        {
            possibleWolfMoves.push("top");
        }
        if (wolf.top < 420)
        {
            possibleWolfMoves.push("bottom");
        }
        if (wolf.left > 20)
        {
            possibleWolfMoves.push("left");
        }
        if (wolf.left < 1020)
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
        this.soundToPlay = new Audio('sounds/newLife.mp3'); 
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

