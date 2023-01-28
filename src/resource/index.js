import {
    reset,
    setFrequency,
    setSweep,
    setTriggerOut,
    startOscilloscope,
    switchGenerator,
    switchOscilloscope
} from "../service/oscilloscopeService.js";
import {CanvasService} from "../service/canvasService.js";

const $btnOnGenerator = document.querySelector("#onGenerator");
const $btnOffGenerator = document.querySelector("#offGenerator");
const $btnOnOscilloscope = document.querySelector("#oscilloscopeOn");
const $btnOffOscilloscope = document.querySelector("#oscilloscopeOff");
const $btnChoose6 = document.querySelector("#choice6sec");
const $btnChoose3 = document.querySelector("#choice3sec");
const $btnChoose1_5 = document.querySelector("#choice1_5sec");
const $inputFrequency = document.querySelector("#frequency");
const $reset = document.querySelector("#reset");
const triggerOuts = [
    document.querySelector("#output1"),
    document.querySelector("#output3"),
    document.querySelector("#output2")];
const canvas = new CanvasService({
        $domCanvas: document.querySelector("#oscilloscope_canvas"),
        width: 300,
        height: 240,
    }
)

const printTriggerValue = (value, triggerIndex) => {
    triggerOuts[triggerIndex].innerHTML = value ? "1" : "0";
}

const handleSwitchGenerator = (isOn) => {
    if (isOn) {
        $btnOffGenerator.style.background = "grey";
        $btnOnGenerator.style.background = "green";
    } else {
        $btnOffGenerator.style.background = "red";
        $btnOnGenerator.style.background = "grey";
    }
    switchGenerator(isOn);
}

const setTimeUpdate = function () {
    setSweep(this.value);
}

let isReset = false;
window.addEventListener("load", () => {
    setTriggerOut(printTriggerValue);
    startOscilloscope(canvas);
    $btnOnGenerator.addEventListener("click", () => handleSwitchGenerator(true));
    $btnOffGenerator.addEventListener("click", () => handleSwitchGenerator(false));
    $btnOnOscilloscope.addEventListener("change", () => switchOscilloscope(true));
    $btnOffOscilloscope.addEventListener("change", () => switchOscilloscope(false));
    $btnChoose6.addEventListener("click", setTimeUpdate.bind($btnChoose6));
    $btnChoose3.addEventListener("click", setTimeUpdate.bind($btnChoose3));
    $btnChoose1_5.addEventListener("click", setTimeUpdate.bind($btnChoose1_5));
    $inputFrequency.addEventListener("change", () => {
        let frequency = $inputFrequency.value;
        if (frequency > 0 && frequency <= 20) {
            setFrequency(frequency);
        } else {
            alert("Frequency should be between 0 and 20")
        }
    });
    $reset.addEventListener("click", () => {
        isReset = !isReset;
        reset(isReset);
        $reset.innerHTML = isReset ? "1" : "0";
    })
});