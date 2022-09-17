class TimeKeeper {

    minutes = 0;
    seconds = 0;
    starting_minutes = 0;
    starting_seconds = 0;
    starting_datetime = new Date();

    constructor(minutes, seconds ){
        this.starting_minutes = minutes;
        this.starting_seconds = seconds;
        this.minutes = minutes;
        this.seconds = seconds;
        this.starting_datetime = new Date();
    }
    display = () => {
        console.log("Mins: "+this.minutes + ", secs: "+this.seconds);
    }
    tickDown = () => {
        if (this.minutes === 0 && this.seconds === 0) {
            doNotification();
            this.minutes = this.starting_minutes;
            this.seconds = this.starting_seconds;
          } else if (this.minutes > 0 && this.seconds <= 0) {
            this.minutes--;
            this.seconds = 59;
          } else {
            this.seconds--;
          }
    }
    reSync = () => {
        if (!this.startDateTime) {
            return;
          }
  
          let nowDate = new Date();
          let millisDiff = nowDate.getTime() - this.startDateTime.getTime();
  
          let minDiff = Math.floor(millisDiff / 1000 / 60);
          let secDiff = Math.ceil(millisDiff / 1000 - minDiff * 60);
  
          this.minutes = starting_minutes - 1 - minDiff;
          if (this.minutes <= 0) {
            doNotification();
            this.minutes = starting_minutes - 1;
          }
          this.seconds = 60 - secDiff;
    }
    reset = () => {
        this.minutes = this.starting_minutes;
        this.seconds = this.starting_seconds;
    }

}