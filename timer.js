const minutes_input = document.querySelector("#input_minutes");
const seconds_input = document.querySelector("#input_seconds");
const timeleft = document.querySelector("#timeleft");
const startbutton = document.querySelector("#startbutton");
const resetbutton = document.querySelector("#resetbutton");
const malevoice_cb = document.querySelector("#malevoice_cb");
const pushnotification_cb = document.querySelector("#pushnotification_cb");

const malevoice = new Audio("malevoice.mp3");

let running_flag = false;
let timer = null;
let startDateTime = null;
let dateStillRunningChecker = null;
let timekeeper = new TimeKeeper(20, 0);

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
    timekeeper = new TimeKeeper(value, parseInt(seconds_input.value));
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
    timekeeper = new TimeKeeper(parseInt(minutes_input.value), value);
    timeleftUpdate(parseInt(minutes_input.value), value);
  });

  startbutton.addEventListener("click", () => {
    if (!running_flag) {
      running_flag = true;
      // Timer wasn't running.
      startbutton.value = "Stop timer";

      timekeeper.tickDown()
      timeleftUpdate(timekeeper.minutes, timekeeper.seconds);

      // Every second, remove a second.
      timer = setInterval(() => {
        timekeeper.tickDown();
        timeleftUpdate(timekeeper.minutes, timekeeper.seconds);
      }, 1000);

      dateStillRunningChecker = setInterval(() => {
        timekeeper.reSync()
        timeleftUpdate(timekeeper.minutes, timekeeper.seconds);
      }, 10000);
    } else {
      // Timer was running.
      stopTimer();
      startDateTime = null;
    }
  });

  resetbutton.addEventListener("click", () => {
    stopTimer();
    timekeeper.reset();
    timeleftUpdate(
      timekeeper.minutes,
      timekeeper.seconds
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
  const isMobile = navigator.userAgentData.mobile
  startDateTime = new Date();
  if (malevoice_cb.checked) {
    malevoice.play();
  }
  if (isMobile) return;
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
