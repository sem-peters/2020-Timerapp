const minutes_input = document.querySelector("#input_minutes");
const seconds_input = document.querySelector("#input_seconds");
const timeleft = document.querySelector("#timeleft");
const startbutton = document.querySelector("#startbutton");
const resetbutton = document.querySelector("#resetbutton");
const malevoice_cb = document.querySelector("#malevoice_cb");
const pushnotification_cb = document.querySelector("#pushnotification_cb");

const malevoice = new Audio("malevoice.mp3");

let mins = 0;
let secs = 0;

let running_flag = false;
let timer = null;
let startDateTime = null;
let dateStillRunningChecker = null;

window.onload = () => {
  addListeners();
};

function timeleftUpdate(minutes, seconds) {
  let lefthandside = "";
  let righthandside = "";

  if (minutes <= 9) {
    lefthandside += "0";
  }
  if (seconds <= 9) {
    righthandside += "0";
  }

  lefthandside += minutes;
  righthandside += seconds;

  let newspan = lefthandside + ":" + righthandside;

  timeleft.innerHTML = newspan;
}

function addListeners() {
  minutes_input.addEventListener("input", () => {
    stopTimer();
    minutes_input.value = minutes_input.value.replace(/\D/gim, "");
    if (!minutes_input.value || "" == minutes_input.value) {
      minutes_input.value = 0;
    } else {
      if (minutes_input.value <= 0) {
        minutes_input.value = 0;
      }
    }

    let value = parseInt(minutes_input.value);
    timeleftUpdate(value, parseInt(seconds_input.value));
  });

  seconds_input.addEventListener("input", () => {
    stopTimer();
    seconds_input.value = seconds_input.value.replace(/\D/gim, "");
    if (!seconds_input.value || "" == seconds_input.value) {
      seconds_input.value = 0;
    } else {
      if (seconds_input.value <= 0) {
        seconds_input.value = 0;
      } else if (seconds_input.value >= 59) {
        seconds_input.value = 59;
      }
    }

    let value = parseInt(seconds_input.value);
    timeleftUpdate(parseInt(minutes_input.value), value);
  });

  startbutton.addEventListener("click", () => {
    if (!running_flag) {
      running_flag = true;
      // Timer wasn't running.
      startDateTime = new Date();
      startbutton.value = "Stop timer";

      let min_sec = timeleft.innerHTML.split(":");
      mins = parseInt(min_sec[0]);
      secs = parseInt(min_sec[1]);

      // Every second, remove a second.
      timer = setInterval(() => {
        if (mins === 0 && secs === 0) {
          doNotification();
          mins = parseInt(minutes_input.value);
          secs = parseInt(seconds_input.value);
        } else if (mins > 0 && secs === 0) {
          mins--;
          secs = 59;
        } else {
          secs--;
        }
        timeleftUpdate(mins, secs);
      }, 1000);

      dateStillRunningChecker = setInterval(() => {
        if (!startDateTime) {
          return;
        }

        let nowDate = new Date();
        let millisDiff = nowDate.getTime() - startDateTime.getTime();

        let minDiff = Math.floor(millisDiff / 1000 / 60);
        let secDiff = Math.ceil(millisDiff / 1000 - minDiff * 60);

        mins = parseInt(minutes_input.value) - 1 - minDiff;
        if (mins <= 0) {
          doNotification();
          mins = parseInt(minutes_input.value) - 1;
        }
        secs = 60 - secDiff;

        console.log("Mins:secs = " + mins + ":" + secs);
        timeleftUpdate(mins, secs);
      }, 10000);
    } else {
      // Timer was running.
      stopTimer();
      startDateTime = null;
    }
  });

  resetbutton.addEventListener("click", () => {
    stopTimer();
    timeleftUpdate(
      parseInt(minutes_input.value),
      parseInt(seconds_input.value)
    );
  });
}

function stopTimer() {
  window.clearInterval(timer);
  timer = null;
  window.clearInterval(dateStillRunningChecker);
  dateStillRunningChecker = null;
  startDateTime = null;
  running_flag = false;
  startbutton.value = "Start timer";
}

function doNotification() {
  startDateTime = new Date();
  if (malevoice_cb.checked) {
    malevoice.play();
  }
  if (pushnotification_cb.checked) {
    if (Notification.permission === "granted") {
      new Notification("Look away from the screen!", {
        body: "Look away from the screen!",
      });
    } else {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          new Notification("Look away from the screen!", {
            body: "Look away from the screen!",
          });
        } else {
          document.querySelector("#error").innerHTML =
            "Push notifications disabled";
        }
      });
    }
  }
}
