# Pouleto Game 

This is a simple game where a chicken has to eat seeds before the wolf eats him.

# Ideas

Function to increase speed of seeds :
delay between two seeds increases every 5 points 
if (score % 5 == 0)
{
    seedDelay /= 1.2;
    clearInterval(seedInterval);
    seedInterval = setInterval(() => newSeed("normal_seed"), seedDelay);
}