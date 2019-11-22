function minTwoDigits(n) 
{
    return (n < 10 ? '0' : '') + n;
}

class Timer
{
    constructor()
    {
        this.timerCalculation = null;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
        this.finalTime;
    }

    start() 
    {
        this.timerCalculation = setInterval(() => 
        {
            this.milliseconds = this.milliseconds + 100;
            if (this.milliseconds === 1000)
            {
                this.milliseconds = 0;
                this.seconds = this.seconds + 1;
            }
            if (this.seconds === 60)
            {
                this.seconds = 0;
                this.minutes = this.minutes + 1;
            }
            if (this.minutes === 60)
            {
                this.minutes = 0;
                this.hours = hours + 1;
            }
            if (this.hours === 24)
            {
                clearInterval(this.timerCalculation);
            }

            document.getElementById("timer").innerHTML = minTwoDigits(this.minutes) + ":" + minTwoDigits(this.seconds) + ":" + (this.milliseconds / 10);

        }, 100)
    }

    stop() 
    {
        clearInterval(this.timerCalculation);
        this.finalTime = minTwoDigits(this.minutes) + ":" + minTwoDigits(this.seconds) + ":" + (this.milliseconds / 10);
    }

    reinitialize()
    {
        this.timerCalculation = null;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
    }

    getTime() 
    {
        return { 
            hours: this.hours, 
            minutes: this.minutes, 
            seconds: this.seconds, 
            milliseconds: this.milliseconds 
        };
    }

}

