function updateLives(NumberOfLives)
{

    if (NumberOfLives < 0)
    {
        NumberOfLives = 0;
    }
    
    while (pouletoLivesDisplay.firstChild) // initializing : removing all displayed lives
    {
        pouletoLivesDisplay.removeChild(pouletoLivesDisplay.firstChild);
    }

    for (let i = 0; i < NumberOfLives; i++) // displaying active lives
    {
        const life = document.createElement("div");
        life.className = "life lifeok";
        pouletoLivesDisplay.appendChild(life);
    }

    if (NumberOfLives < pouletoLives) // displaying lost lives if there is some
    {
        for (let j = 0; j < (pouletoLives - NumberOfLives); j++)
        {
            const life = document.createElement("div");
            life.className = "life lifeempty";
            pouletoLivesDisplay.appendChild(life);
        }
    }
    
    currentPouletoLives = NumberOfLives; // updating current number of lives gobal variable
}

function pouletoHurt()
{
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
}