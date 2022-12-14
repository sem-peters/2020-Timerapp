class TimeKeeper {
  minutes = 0;
  seconds = 0;
  starting_minutes = 0;
  starting_seconds = 0;
  backup_starting_minutes = 0;
  backup_starting_seconds = 0;
  starting_datetime = new Date();

  constructor(minutes_to_set, seconds_to_set) {
    this.backup_starting_minutes = minutes_to_set;
    this.backup_starting_seconds = seconds_to_set;
    this.starting_minutes = minutes_to_set;
    this.starting_seconds = seconds_to_set;
    this.minutes = minutes_to_set;
    this.seconds = seconds_to_set;
    this.starting_datetime = new Date();
  }
  display = () => {
    console.log("Mins: " + this.minutes + ", secs: " + this.seconds);
  };
  tickDown = () => {
    if (this.minutes === 0 && this.seconds === 0) {
      doNotification();
      this.reset();
    } else if (this.minutes > 0 && this.seconds <= 0) {
      this.minutes--;
      this.seconds = 59;
    } else {
      this.seconds--;
    }
  };
  reSync = () => {
    if (!this.starting_datetime) {
      return;
    }

    let nowDate = new Date();
    let millisDiff = nowDate.getTime() - this.starting_datetime.getTime();

    let minDiff = Math.floor(millisDiff / 1000 / 60);
    let secDiff = Math.ceil(millisDiff / 1000 - minDiff * 60);

    this.seconds = this.starting_seconds - secDiff;
    if (this.seconds < 0) {
      this.minutes -= 1;
      this.seconds += 60
    }
    if (this.seconds > this.starting_seconds)
      this.minutes = this.starting_minutes - 1 - minDiff;
    else this.minutes = this.starting_minutes - minDiff;

    if (this.minutes <= 0) {
      doNotification();
      this.reset();
    }
  };
  reset = () => {
    this.minutes = this.backup_starting_minutes;
    this.seconds = this.backup_starting_seconds;
    this.starting_minutes = this.backup_starting_minutes;
    this.starting_seconds = this.backup_starting_seconds;
    this.starting_datetime = new Date();
  };
}
