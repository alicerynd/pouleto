function updateLives(NumberOfLives)
{
    // making sure number of lives remains coherent
    if (NumberOfLives < 0)
    {NumberOfLives = 0;}
    if (NumberOfLives > pouletoLives)
    {NumberOfLives = pouletoLives;}
    
    // initializing : removing all displayed lives
    while (pouletoLivesDisplay.firstChild) 
    {pouletoLivesDisplay.removeChild(pouletoLivesDisplay.firstChild);}

    // displaying active lives
    for (let i = 0; i < NumberOfLives; i++) 
    {
        const life = document.createElement("div");
        life.className = "life lifeok";
        pouletoLivesDisplay.appendChild(life);
    }

    // displaying lost lives if there is some
    if (NumberOfLives < pouletoLives) 
    {
        for (let j = 0; j < (pouletoLives - NumberOfLives); j++)
        {
            const life = document.createElement("div");
            life.className = "life lifeempty";
            pouletoLivesDisplay.appendChild(life);
        }
    }
    
    // updating current number of lives gobal variable
    currentPouletoLives = NumberOfLives; 
}

function pouletoHurt()
{
    let hurtGifDuration = 1300;

    // if pouleto was turning right when hit
    if (pouleto.style.backgroundImage == "url(\"images/pouleto_right.png\")")
    {
        pouleto.style.backgroundImage = "url(\"images/pouleto_hurt_right.gif\")";
        document.onkeydown = undefined;
        setTimeout(() =>
        { 
            pouleto.style.backgroundImage = "url(\"images/pouleto_right.png\")";
            document.onkeydown = movePouleto;
        }, hurtGifDuration);
    }

    // if pouleto was turning left when hit
    else if (pouleto.style.backgroundImage == "url(\"images/pouleto_left.png\")")
    {
        pouleto.style.backgroundImage = "url(\"images/pouleto_hurt_left.gif\")";
        document.onkeydown = undefined;
        setTimeout(() =>
        { 
            pouleto.style.backgroundImage = "url(\"images/pouleto_left.png\")";
            document.onkeydown = movePouleto;
        }, hurtGifDuration);
    }
}