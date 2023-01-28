import {Line} from "../model/line.js";

const POSITIVE_HEIGHT = 30;
const CHART_WIDTH = 4;

let sweepTime = 6000;
let isOscilloscopeOn = false;
let canvas;
let generator = {
    isOn: false,
    frequency: 2,
    isPositive: false,
    location: {
        x: 0,
        y: 50
    },
    zeroLevel: 50,
    color: "#4177b2"
}


let triggers = [
    {isInvert: false, value: false, dependent: null, location: {x: 0, y: 110}, color: "#9a2f2f", setOut: null},
    {isInvert: false, value: false, dependent: null, location: {x: 0, y: 170}, color: "#9a2f2f", setOut: null},
    {isInvert: true, value: false, dependent: null, location: {x: 0, y: 230}, color: "#9a2f2f", setOut: null},
];
triggers[0].dependent = triggers[1];
triggers[1].dependent = triggers[2];
triggers[2].dependent = triggers[0];

const runOscilloscope = (x) => {
    if (canvas.width === x || !isOscilloscopeOn) {
        x = 0;
        clear()
    }
    generator.location.x = x;
    drawHorizontal(generator);
    triggers.forEach(t => {
        t.location.x = x;
        drawHorizontal(t);
    });
    setTimeout(runOscilloscope, sweepTime / canvas.width, x + 1)
}

const doHalfGeneratorOscillation = () => {
    if (generator.isOn) {
        generator.isPositive = !generator.isPositive;
        let oldY = generator.location.y;
        generator.location.y = generator.isPositive ?
            generator.location.y - POSITIVE_HEIGHT :
            generator.location.y + POSITIVE_HEIGHT;
        drawVertical(generator, oldY);
        generator.isPositive && sendTriggersValue();
    }
    setTimeout(doHalfGeneratorOscillation, (1000 / generator.frequency) / 2);
}

const drawVertical = (chartProvider, oldY) => {
    canvas.drawLine(new Line({
        color: chartProvider.color,
        x: chartProvider.location.x,
        y: oldY,
        yEnd: chartProvider.location.y,
        xEnd: chartProvider.location.x,
        lineWidth: CHART_WIDTH
    }));
}

const drawHorizontal = (chartProvider) => {
    canvas.drawLine(new Line({
        color: chartProvider.color,
        x: chartProvider.location.x,
        y: chartProvider.location.y,
        xEnd: chartProvider.location.x + 1,
        yEnd: chartProvider.location.y,
        lineWidth: CHART_WIDTH
    }));
}

const sendTriggersValue = () => {
    let triggerValues = triggers.map(t => t.isInvert ? !t.value : t.value);
    for (let i = 0; i < triggerValues.length; i++) {
        let trigger = triggers[(i + 1) % triggerValues.length];
        changeTriggerValue(trigger, triggerValues[i]);
        trigger.setOut(trigger.value, i);
    }
}

const changeTriggerValue = (trigger, value) => {
    if (value !== trigger.value) {
        let oldY = trigger.location.y;
        value ? trigger.location.y = trigger.location.y - POSITIVE_HEIGHT :
            trigger.location.y = trigger.location.y + POSITIVE_HEIGHT;
        drawVertical(trigger, oldY);
        trigger.value = value;
    }
}

const clear = () => {
    canvas.clear();
    canvas.drawCells(30);
    canvas.drawCross('#ffffff');
}

export const reset = (isReset) => {
    if (isReset) {
        triggers.forEach(t => {
            let oldY = t.location.y;
            t.value && (t.location.y = t.location.y + POSITIVE_HEIGHT);
            t.value = false;
            drawVertical(t, oldY);
        });
        triggers[2].isInvert = false;
    } else {
        triggers[2].isInvert = true;
    }
}

export const switchOscilloscope = (isOn) => {
    isOscilloscopeOn = isOn
    clear();
}

export const setTriggerOut = (setOut) => {
    triggers.forEach(t => t.setOut = setOut);
}

export const switchGenerator = (isOn) => {
    generator.isOn = isOn;
    generator.isPositive = false;
    generator.location.y = generator.zeroLevel;
    triggers.forEach(t => t.location.x = 0);
    generator.location.x = 0;
}

export const setSweep = (deltaTime) => {
    sweepTime = deltaTime;
}

export const setFrequency = (frequency) => {
    generator.frequency = frequency;
}

export const startOscilloscope = (canvasService) => {
    canvas = canvasService;
    canvas.resize();
    canvas.drawCells(30);
    canvas.drawCross('#ffffff');
    runOscilloscope(0);
    doHalfGeneratorOscillation();
}