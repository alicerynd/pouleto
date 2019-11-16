// START GAME

updateLives(pouletoLives); // initializing : setting pouleto lives to maximum

function startGame()
{
    gameStatus = "gameOn";

    intro.style.display = "none"; // masking intro bloc
    pauseButton.style.display = "block"; // showing pause button
    pouleto.style.display = "block"; // showing pouleto 
    
    // starting items spawn
    seedInterval = setInterval(() => newSeed("normal_seed"), seedDelay);
    goldenSeedInterval = setInterval(() => newSeed("golden_seed"), goldenSeedDelay);
    wolfInterval = setInterval(newWolf, wolfDelay);
    tractorInterval = setInterval(newTractor, tractorDelay);
    lifeInterval = setInterval(newLife, lifeDelay);
}

// PAUSE GAME

function pauseGame()
{
    if (gameStatus == "gameOn")
    {
        clearInterval(seedInterval);
        clearInterval(goldenSeedInterval);
        clearInterval(wolfInterval);
        clearInterval(lifeInterval);
        
        clearInterval(wolfMovesInterval);
        clearInterval(tractorInterval);
        clearInterval(tractorMovesInterval);

        gameStatus = "gameStopped";
        pauseButton.innerHTML = "Start";
        pause.style.display = "block";
    }
    else if (gameStatus == "gameStopped")
    {
        startGame();
        pauseButton.innerHTML = "Pause";
        gameStatus = "gameOn";
        pause.style.display = "none";
    }    
}

// END GAME

function endGame()
{
    // clearning intervals to stop new items from spawning and existing item from moving
    clearInterval(seedInterval);
    clearInterval(goldenSeedInterval);
    clearInterval(wolfInterval);
    clearInterval(wolfMovesInterval);
    clearInterval(tractorInterval);
    clearInterval(tractorMovesInterval);
    clearInterval(lifeInterval);

    pouleto.style.display = "none";
    
    if (wolf != undefined)
    {
        field.removeChild(document.getElementById("wolf"));
        clearTimeout(wolfTimeout);
    }

    if (tractor != undefined)
    {
        field.removeChild(document.getElementById("tractor"));
        clearTimeout(tractorTimeout);
    }

    pauseButton.style.display = "none";
    restartButton.style.display = "block";
}

// LOOSE GAME

function looseGame()
{
    endGame();
    displayScoreEndLoose.innerHTML = score;
    lost.style.display = "block";
}

// WIN GAME

function winGame()
{
    endGame();
    displayScoreEndWin.innerHTML = score;
    won.style.display = "block";
}

// RESTART GAME

function restartGame()
{    
    updateLives(pouletoLives); // initializing : setting pouleto lives to maximum
    score = 0;
    lifeDelay = 10000;
    pouleto_left = 20; 
    pouleto_top = 20; 
    pouleto.style.left = pouleto_left + "px";
    pouleto.style.top = pouleto_top + "px";
    
    //removing all existing seeds
    allSeeds = [];
    Array.from(document.getElementsByClassName("seed")).forEach((seed) => 
    {
        seed.lock = false;
        clearTimeout(seed.seedTimeout);
        field.removeChild(seed);
    }
    );
    
    if (wolf != undefined)
    {field.removeChild(document.getElementById("wolf"));}

    if (tractor != undefined)
    {field.removeChild(document.getElementById("tractor"));}

    displayScore.innerHTML = score;
    restartButton.style.display = "none";
    pauseButton.style.display = "block";
    lost.style.display = "none";
    won.style.display = "none";
    
    startGame();
}