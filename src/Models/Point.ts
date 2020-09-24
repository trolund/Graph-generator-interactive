import p5Types from "p5"; //Import this for typechecking and intellisense
import { PointConfig } from "../Types/PointConfig";

class Point {
  p5: p5Types;

  x: number;
  y: number;

  xOrigen: number;
  yOrigen: number;

  xMove: number;
  yMove: number;
  xBound: number;
  yBound: number;

  size: number;
  partners: Point[] = [];

  color: any;

  smoothAnimation: boolean;

  canvasWidth: number;
  canvasHeight: number;

  constructor(p5: p5Types, config: PointConfig) {
    const {
      canvasHeight,
      canvasWidth,
      color,
      margin,
      maxSpeed,
      minSpeed,
      sizeMax,
      sizeMin,
      smoothAnimation,
    } = config;

    this.p5 = p5;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.smoothAnimation = smoothAnimation;

    this.x = p5.random(margin, canvasWidth - margin);
    this.y = p5.random(margin, canvasHeight - margin);

    this.xOrigen = this.x;
    this.yOrigen = this.y;

    this.xMove = p5.random(minSpeed, maxSpeed);
    this.yMove = p5.random(minSpeed, maxSpeed);

    this.xBound = this.xOrigen + p5.random(100, 200);
    this.yBound = this.yOrigen + p5.random(100, 200);

    this.size = p5.random(sizeMin, sizeMax);

    this.partners = [];

    // random color
    this.color = color; //color(random(0, 255), random(0, 255), random(0, 255));
  }

  move() {
    this.draw();

    if (this.smoothAnimation) {
      this.x += this.xMove;
      if (
        this.x > this.canvasWidth - this.size / 2 ||
        this.x < 0 + this.size / 2
      ) {
        this.xMove *= -1;
      }

      this.y += this.yMove;
      if (
        this.y > this.canvasHeight - this.size / 2 ||
        this.y < 0 + this.size / 2
      ) {
        this.yMove *= -1;
      }
    } else {
      this.x += this.p5.random(-this.xMove, this.xMove);
      this.y += this.p5.random(-this.yMove, this.yMove);
    }
  }

  draw() {
    this.p5.circle(this.x, this.y, this.size);

    this.p5.fill(this.color);
    this.p5.ellipse(this.x, this.y, this.size);

    for (var i = 0; i < this.partners.length - 1; i++) {
      this.p5.stroke(this.color);
      this.p5.line(this.partners[i].x, this.partners[i].y, this.x, this.y);
    }
  }
}

export { Point };
