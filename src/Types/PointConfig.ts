import p5Types from "p5";
export type PointConfig = {
  margin: number;
  canvasWidth: number;
  canvasHeight: number;
  minSpeed: number;
  maxSpeed: number;
  sizeMin: number;
  sizeMax: number;
  color: p5Types.Color;
  smoothAnimation: boolean;
};
