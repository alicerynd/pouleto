function updateLives(NumberOfLives)
{

    while (pouletoLivesDisplay.firstChild) 
    {
        pouletoLivesDisplay.removeChild(pouletoLivesDisplay.firstChild);
    }

    for (let i = 0; i < NumberOfLives; i++)
    {
        const life = document.createElement("div");
        life.className = "life lifeok";
        pouletoLivesDisplay.appendChild(life);
    }

    if (NumberOfLives < pouletoLives)
    {
        for (let j = 0; j < (pouletoLives - NumberOfLives); j++)
        {
            const life = document.createElement("div");
            life.className = "life lifeempty";
            pouletoLivesDisplay.appendChild(life);
        }
    }
    
    currentPouletoLives = NumberOfLives;
}