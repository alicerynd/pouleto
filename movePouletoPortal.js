document.onkeydown = movePouleto;
let pouletoOnBottomPortal = false;
let pouletoOnTopPortal = false;

function detectCollision()
{
    hitSeed();
    hitWolf();
    hitLife();
}

function movePouleto(e) 
{
    e = e || window.event;

    if (e.keyCode == '38') // up arrow
    {
        if (pouleto_top >= 120)
        {
            pouleto_top = pouleto_top - 100;
            pouleto.style.top = pouleto_top + "px";
            detectCollision();
        } 
    }
    else if (e.keyCode == '40') // down arrow
    {
        if (pouleto_top <= 320)
        {
            pouleto_top = pouleto_top + 100;
            pouleto.style.top = pouleto_top + "px";
            detectCollision();
        }
    }
    else if (e.keyCode == '37') // left arrow
    {
        if (pouleto_left == 20 && pouleto_top == 20)
        {pouletoOnTopPortal = true;}
        else
        {pouletoOnTopPortal = false;}

        if (!pouletoOnTopPortal && pouleto_left >= 120)
        {
            pouleto.style.backgroundImage = "url(\"images/pouleto_left.png\")";
            pouleto_left = pouleto_left - 100;
            pouleto.style.left = pouleto_left + "px";
            detectCollision();
        }
        else if (pouletoOnTopPortal)
        {
            pouleto_left = 1020;
            pouleto_top = 420;
            pouleto.style.left = pouleto_left + "px";
            pouleto.style.top = pouleto_top + "px";
            pouleto.style.backgroundImage = "url(\"images/pouleto_left.png\")";
            detectCollision();
        }
    }
    else if (e.keyCode == '39') // right arrow
    {
        if (pouleto_left == 1020 && pouleto_top == 420)
        {pouletoOnBottomPortal = true;}
        else
        {pouletoOnBottomPortal = false;}

        if (!pouletoOnBottomPortal && pouleto_left <= 920)
        {
            pouleto.style.backgroundImage = "url(\"images/pouleto_right.png\")";
            pouleto_left = pouleto_left + 100;
            pouleto.style.left = pouleto_left + "px";
            detectCollision();
        }
        else if (pouletoOnBottomPortal)
        {
            pouleto_left = 20;
            pouleto_top = 20;
            pouleto.style.left = pouleto_left + "px";
            pouleto.style.top = pouleto_top + "px";
            pouleto.style.backgroundImage = "url(\"images/pouleto_right.png\")";
            detectCollision();
        }
    }
}