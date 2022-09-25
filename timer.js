const minutes_input = document.querySelector("#input_minutes");
const seconds_input = document.querySelector("#input_seconds");
const timeleft = document.querySelector("#timeleft");
const startbutton = document.querySelector("#startbutton");
const resetbutton = document.querySelector("#resetbutton");
const malevoice_cb = document.querySelector("#malevoice_cb");
const pushnotification_cb = document.querySelector("#pushnotification_cb");
const skiplinks = document.querySelector('.skiplinks');

const malevoice = new Audio("malevoice.mp3");
navigator.serviceWorker.register('sw.js');

let running_flag = false;
let timer = null;
let dateStillRunningChecker = null;
let timekeeper = new TimeKeeper(20, 0);

window.onload = () => {
  addListeners();
  testMobile();
};

function testMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
   (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
    document.querySelector("#messages").innerHTML += "This webapp is designed for desktop and laptop devices, not for phones and tablets. For such devices, it's recommended to install a native app from the device app store. <br>"
  }
}

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

      timekeeper.starting_datetime = new Date();

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
  // Clear timers
  window.clearInterval(timer);
  window.clearInterval(dateStillRunningChecker);
  timer = null;
  dateStillRunningChecker = null;

  // No longer running
  running_flag = false;
  startbutton.value = "Start timer";

  // Move starting minutes to current seconds, reset on next notification to backup_starting_<timeunit>
  timekeeper.starting_minutes = timekeeper.minutes;
  timekeeper.starting_seconds = timekeeper.seconds;
}

function doNotification() {
  if (malevoice_cb.checked) {
    malevoice.play();
  }
  if (pushnotification_cb.checked) {
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification('Look away from the screen!');
        });
      }
    });
  
  }
}
