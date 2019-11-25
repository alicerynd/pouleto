// Loader

setTimeout(function () // fade out loading bloc
{
    loading.classList.toggle('fade');
}, 1000);

setTimeout(function() // showing header, mynavbar and field blocs
{
    loading.style.display = "none";
    content.style.display = "block";
}, 1500);

setTimeout(function()
{
    content.classList.toggle('fade'); 
}, 1600);