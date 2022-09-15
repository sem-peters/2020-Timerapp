const minutes_input = document.querySelector("#input_minutes");
const seconds_input = document.querySelector("#input_seconds");
const timeleft = document.querySelector("#timeleft");
const startbutton = document.querySelector("#startbutton");
const resetbutton = document.querySelector("#resetbutton");
const malevoice_cb = document.querySelector("#malevoice_cb");
const pushnotification_cb = document.querySelector("#pushnotification_cb");

const malevoice = new Audio('/malevoice.mp3');


let running_flag = false;
let timer = null;


window.onload = () => {
    addListeners();
    var notification = new Notification("Look away from the screen!", {
        body: 'Look away from the screen!'
    })
}

function timeleftUpdate(minutes, seconds) {

    let lefthandside = "";
    let righthandside = "";

    if (minutes <= 9) {
        lefthandside += "0";
    }
    if (seconds <= 9) {
        righthandside += "0"
    }
    
    lefthandside += minutes;
    righthandside += seconds;

    let newspan = lefthandside + ":" + righthandside;
    
    timeleft.innerHTML = newspan;
}

function addListeners() {

    minutes_input.addEventListener("input", () => {
        stopTimer();
        minutes_input.value = minutes_input.value.replace(/\D/gmi, "");
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
        seconds_input.value = seconds_input.value.replace(/\D/gmi, "");
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
            // Timer wasn't running.
            startbutton.value = "Stop timer";

            let min_sec = timeleft.innerHTML.split(":");
            let mins = parseInt(min_sec[0]);
            let secs = parseInt(min_sec[1]);

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
        } else {
            // Timer was running.
            stopTimer();
            
        }

        running_flag = !running_flag;
    })

    resetbutton.addEventListener("click", () => {
        running_flag = !running_flag;
        window.clearInterval(timer);
        
        timeleftUpdate(parseInt(minutes_input.value), parseInt(seconds_input.value));
    })
}

function stopTimer() {
    startbutton.value = "Start timer";
    window.clearInterval(timer);
    running_flag = false;
}

function doNotification() {

    if(malevoice_cb.checked) {
        malevoice.play();
    }
    if (pushnotification_cb.checked) {
        if (Notification.permission === "granted") {
            new Notification("Look away from the screen!", {
                body: "Look away from the screen!"
            });
        } else {
            Notification.requestPermission(permission => {
                if (permission === "granted") {
                    new Notification("Look away from the screen!", {
                        body: "Look away from the screen!"
                    });
                } else {
                    document.querySelector("#error").innerHTML = "Push notifications disabled";
                }
            })
        }
    }
    
}