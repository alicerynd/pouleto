// START GAME

updateLives(pouletoLives); // initializing : setting pouleto lives to maximum

function startGame()
{
    gameStatus = "gameOn";
    intro.style.display = "none";

    pauseButton.style.display = "block";
    pouleto.style.display = "block";
    
    seedInterval = setInterval(() => newSeed("normal_seed"), seedDelay);
    goldenSeedInterval = setInterval(() => newSeed("golden_seed"), goldenSeedDelay);
    wolfInterval = setInterval(newWolf, wolfDelay);
    lifeInterval = setInterval(newLife, lifeDelay);
}

// STOP GAME

function stopGame()
{
    clearInterval(seedInterval);
    clearInterval(goldenSeedInterval);
    clearInterval(wolfInterval);
    clearInterval(lifeInterval);
}

// PAUSE GAME

function pauseGame()
{
    if (gameStatus == "gameOn")
    {
        stopGame();
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

// LOOSE GAME

function looseGame()
{
    stopGame();
    gameStatus = "gameLost";
    displayScoreLost.innerHTML = score;
    pouleto.style.display = "none";
    lost.style.display = "block";
    pauseButton.style.display = "none";
    restartButton.style.display = "block";
}

// RESTART GAME

function restartGame()
{
    gameStatus = "gameOn";
    score = 0;
    lifeDelay = 10000;
    updateLives(pouletoLives); // initializing : setting pouleto lives to maximum
    
    //removing seeds
    allSeeds = [];
    Array.from(document.getElementsByClassName("seed")).forEach((seed) => field.removeChild(seed));
    
    if (wolf != undefined)
    {field.removeChild(document.getElementById("wolf"));}

    displayScore.innerHTML = score;
    restartButton.style.display = "none";
    pauseButton.style.display = "block";
    lost.style.display = "none";
    
    startGame();
}