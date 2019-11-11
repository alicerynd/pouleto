// Loader

setTimeout(function ()
{
    loading.classList.toggle('fade');
}, 1000);

setTimeout(function()
{
    loading.style.display = "none";
    content.style.display = "block";
}, 1500);

setTimeout(function()
{
    content.classList.toggle('fade');
    //startGame();
}, 1600);