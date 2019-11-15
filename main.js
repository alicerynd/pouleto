// VARIABLES

const content = document.getElementById("content"); //used for loader, contains header and field
const field = document.getElementById("field");
const pouleto = document.getElementById("pouleto");
let wolf;
let tractor;
let life = null;

const displayScore = document.getElementById("score"); //displays score during the game
const displayScoreEndLoose = document.getElementById("displayScoreEndLoose"); //displays score when you loose
const displayScoreEndWin = document.getElementById("displayScoreEndWin"); //displays score when you win
const scoreWonIntro = document.getElementById("scoreWon"); //displays score to reach in the intro bloc
const pouletoLivesDisplay = document.getElementById("pouletoLivesDisplay"); //displays number of lives during the game

const Xcoordinates = [20, 120, 220, 320, 420, 520, 620, 720, 820, 920, 1020]; //possible horizontal positions
const Ycoordinates = [20, 120, 220, 320, 420]; //possible vertical positions

const loading = document.getElementById("loading");
const intro = document.getElementById("intro"); 
const pause = document.getElementById("pause");
const lost = document.getElementById("lost");
const won = document.getElementById("won");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

let gameStatus = "gameOn"; //set initial Game Status
let score = 0; //set initial score
let scoreWon = 50; //set score you need to win a game
scoreWonIntro.innerHTML = scoreWon;
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

let tractorInterval; //new tractor interval
let tractorDelay = 7000; //time between 2 tractors
let tractorMovesInterval; //new tractor movement interval

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
     
        this.afterElement = document.createElement("div");
        this.afterElement.className = "plusFive";
        this.afterElement.timeout = 1200;
        this.afterElement.style.left = this.left + "px";
        this.afterElement.style.top = this.top + "px";
        
        this.seedTimeout = null;
    }
}

function newSeed(seedType)
{
    let newSeed = new Seed("seed" + seedId, seedType);
    let tryNewSeed = false;

    while (!tryNewSeed) //checking if the seed appeared on an already existing seed
    {
        let verifySeeds = allSeeds.find((existingSeed) => newSeed.top === existingSeed.top && newSeed.left === existingSeed.left);
        {
            if (verifySeeds != undefined || pouleto_top === newSeed.top && pouleto_left === newSeed.left)
            {
                console.log("A seed appeared on an already existing seed or on pouleto")
                tryNewSeed = false;
                newSeed = undefined;
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

    hitSeed(); // checking if the new seed appeared on pouleto
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

        if (seedToRemove.htmlElement.className == "seed golden_seed")
        {
            field.appendChild(seedToRemove.afterElement);
            setTimeout(function()
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
        this.soundToPlay = new Audio('sounds/wolf.mp3'); 

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
    if (wolf != undefined && pouleto_top === wolf.top && pouleto_left === wolf.left) //checking if wolf is here, and if he is on pouetlo
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
        setTimeout(function()
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
        this.htmlElement = document.createElement("div");
        this.htmlElement.innerHTML = '<img style="width: 130px;" src="images/tractor.gif" />';
        this.htmlElement.id = "tractor";
        this.left = -80;
        this.top = Ycoordinates[Math.floor(Math.random() * Ycoordinates.length)];
        this.htmlElement.style.left = this.left + "px";
        this.htmlElement.style.top = this.top + "px";
        this.movesDone = 0;
        this.damage = 3;
        this.soundToPlay = new Audio('sounds/chickenscream.mp3'); 
    }
}

function newTractor()
{
    tractor = new Tractor(); 
    
    field.appendChild(tractor.htmlElement);
    tractorMovesInterval = setInterval(moveTractor, 500);
    tractorTimeout = setTimeout(function()
    {
        field.removeChild(tractor.htmlElement);
        clearInterval(tractorMovesInterval);
        tractor = undefined;
    }, 6500);
}

function hitTractor()
{
    if (tractor != undefined && pouleto_top === tractor.top && pouleto_left === tractor.left) //checking if tractor is here, and if he is on pouetlo
    {
        tractor.soundToPlay.play();
        
        updateLives(currentPouletoLives - tractor.damage)
        
        clearTimeout(tractorTimeout);
        clearInterval(tractorMovesInterval);
        field.removeChild(tractor.htmlElement);
        tractor = undefined;

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
        if (tractor.movesDone < 13)
        {
            tractor.left = tractor.left + 100;
            tractor.htmlElement.style.left = tractor.left + "px";
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

