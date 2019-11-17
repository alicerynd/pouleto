// START GAME

updateLives(pouletoLives); // initializing : setting pouleto lives to maximum

function startGame()
{
    intro.style.display = "none"; // masking intro bloc
    gameTimer.start();
    pouleto.style.display = "block"; // showing pouleto 
    
    // starting items spawn
    normalSeedInterval = setInterval(() => newSeed("normalSeed"), normalSeedDelay);
    goldenSeedInterval = setInterval(() => newSeed("goldenSeed"), goldenSeedDelay);
    superSeedInterval = setInterval(() => newSeed("superSeed"), superSeedDelay);
    wolfInterval = setInterval(newWolf, wolfDelay);
    tractorInterval = setInterval(newTractor, tractorDelay);
    lifeInterval = setInterval(newLife, lifeDelay);
}

// END GAME

function endGame()
{
    // clearning intervals to stop new items from spawning and existing item from moving
    clearInterval(normalSeedInterval);
    clearInterval(goldenSeedInterval);
    clearInterval(superSeedInterval);

    clearInterval(wolfInterval);
    clearInterval(wolfMovesInterval);
    
    clearInterval(tractorInterval);
    clearInterval(tractorMovesInterval);

    clearInterval(lifeInterval);

    gameTimer.stop();

    pouleto.style.display = "none";
}

// LOOSE GAME

function looseGame()
{
    endGame();
    lost.style.display = "block";
}

// WIN GAME

function winGame()
{
    endGame();
    displayScoreEndWin.innerHTML = score;
    displayFinalTime.innerHTML = gameTimer.finalTime;
    won.style.display = "block";
}

// RESTART GAME

function restartGame()
{   
    endGame();
    gameTimer.reinitialize();
    score = 0;
    updateLives(pouletoLives); // initializing : setting pouleto lives to maximum
    
    lifeDelay = 10000;
    pouleto_left = 20; 
    pouleto_top = 20; 
    pouleto.style.left = pouleto_left + "px";
    pouleto.style.top = pouleto_top + "px";

    displayScore.innerHTML = score;
    lost.style.display = "none";
    won.style.display = "none";
    
    //removing all existing seeds
    Array.from(document.getElementsByClassName("seed")).forEach((seed) => field.removeChild(seed));
    
    allSeeds.forEach((seed) =>
    {
        seed.lock = false;
        clearTimeout(seed.seedTimeout);
        clearTimeout(seed.AfterElementTimeout);
    }
    );
    allSeeds = [];

    // removing Wolf if exists
    if (wolf != undefined)
    {
        field.removeChild(document.getElementById("wolf"));
        clearTimeout(wolfTimeout);
        wolf = undefined;
    }

    // removing Tractor if exists
    if (tractor != undefined)
    {
        field.removeChild(document.getElementById("tractor"));
        clearTimeout(tractorTimeout);
        tractor = undefined;
    }

    startGame();
}