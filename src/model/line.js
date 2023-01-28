export class Line {

    constructor({x, y, xEnd, yEnd, dash, color, lineWidth}) {
        this.x = x;
        this.y = y;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.dash = dash ? dash : [];
        this.color = color ? color : '#000000';
        this.lineWidth = lineWidth ? lineWidth : 1;
    }
}