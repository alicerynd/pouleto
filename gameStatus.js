// START

updateLives(pouletoLives);

function startGame()
{
    gameStatus == "gameOn";
    pauseButton.style.display = "block";
    pouleto.style.display = "block";
    intro.style.display = "none";
    seedInterval = setInterval(() => newSeed("normal_seed"), seedDelay);
    goldenSeedInterval = setInterval(() => newSeed("golden_seed"), goldenSeedDelay);
    wolfInterval = setInterval(newWolf, wolfDelay);
    lifeInterval = setInterval(newLife, lifeDelay);
}

// STOP

function stopGame()
{
    clearInterval(seedInterval);
    clearInterval(goldenSeedInterval);
    clearInterval(wolfInterval);
    clearInterval(lifeInterval);
}

// PAUSE

function pauseGame()
{
    if (gameStatus == "gameOn")
    {
        stopGame();
        gameStatus = "gameStopped"
        pauseButton.innerHTML = "Start"
        pause.style.display = "block"
    }
    else if (gameStatus == "gameStopped")
    {
        startGame();
        pauseButton.innerHTML = "Pause"
        gameStatus = "gameOn"
        pause.style.display = "none"
    }    
}

// LOOSE

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

// RESTART

function restartGame()
{
    gameStatus = "gameOn";
    score = 0;
    lifeDelay = 10000;
    updateLives(pouletoLives);
    
    allSeeds = [];
    Array.from(document.getElementsByClassName("seed")).forEach((seed) => field.removeChild(seed));
    if (wolf != undefined)
    {
        field.removeChild(document.getElementById("wolf"));
    }
    displayScore.innerHTML = score;
    restartButton.style.display = "none";
    pauseButton.style.display = "block";
    lost.style.display = "none";
    
    startGame();
}