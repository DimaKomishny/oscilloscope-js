import {Line} from "../model/line.js";

export class CanvasService {

    constructor(options) {
        this.$domCanvas = options.$domCanvas;
        this.ctx = options.$domCanvas.getContext("2d");
        this.height = options.height ? options.height : 0;
        this.width = options.width ? options.width : 0;
    }

    resize() {
        this.$domCanvas.height = this.height;
        this.$domCanvas.width = this.width;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.$domCanvas.width, this.$domCanvas.height);
    }

    drawLine(line) {
        this.ctx.strokeStyle = line.color;
        this.ctx.lineWidth = line.lineWidth;
        this.ctx.setLineDash(line.dash);
        this.ctx.beginPath();
        this.ctx.moveTo(line.x, line.y);
        this.ctx.lineTo(line.xEnd, line.yEnd);
        this.ctx.stroke();
    }

    drawCells(cellSize) {
        for (let i = 0; i < this.width; i += cellSize) {
            this.drawLine(new Line({
                x: i,
                y: 0,
                xEnd: i,
                yEnd: this.height,
                color: '#ffffff'
            }));
        }
        for (let i = 0; i < this.height; i += cellSize) {
            this.drawLine(new Line({
                x: 0,
                y: i,
                xEnd: this.width,
                yEnd: i,
                color: '#ffffff'
            }));
        }
    }

    drawCross(color) {
        this.drawLine(new Line({
            x: this.width / 2,
            y: 0,
            xEnd: this.width / 2,
            yEnd: this.height,
            color: color,
            lineWidth: 2
        }));
        this.drawLine(new Line({
            x: 0,
            y: this.height / 2,
            xEnd: this.width,
            yEnd: this.height / 2,
            color: color,
            lineWidth: 2
        }));
    }
}
