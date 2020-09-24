import React, { useCallback, useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { Point } from "../Models/Point";
import { PointConfig } from "../Types/PointConfig";
import ReactSlider from "react-slider";
import "./Animation.css";

interface ComponentProps {}

const P5: React.FC<ComponentProps> = (props: ComponentProps) => {
  const [clusterSize, setClusterSize] = useState(5);
  const [playing, setPlaying] = useState(true);
  const [custers, setCusters] = useState([] as Point[][] | null);
  const [globalp5, setGlobalp5] = useState({} as p5Types);
  const [smoothAnimation, setSmoothAnimation] = useState(true);
  const [clusterNumbers, setClusterNumbers] = useState(15);
  const [maxSpeed, setMaxSpeed] = useState(3);
  const [minSpeed, setMinSpeed] = useState(0);
  const [sizeMax, setSizeMax] = useState(20);
  const [sizeMin, setSizeMin] = useState(10);
  const [margin, setMargin] = useState(100);

  const [canvasWidth, setCanvasWidth] = useState(100);
  const [canvasHeight, setCanvasHeight] = useState(100);

  const [connections, setConnections] = useState(2);

  //let clusterSize = 5;
  // let clusterNumbers = 1;
  // let connections = 2;
  // let margin = 100;
  // let canvasWidth = 800;
  // let canvasHeight = 500;
  //let smoothAnimation = true;
  // let maxSpeed = 3;
  //let minSpeed = 0;
  // let sizeMax = 20;
  // let sizeMin = 10;
  let bgColor: number = 10;

  const resizeHandler = useCallback(() => {
    setCanvasWidth((window as any).innerWidth * 0.85);
    setCanvasHeight((window as any).innerHeight);
  }, []);

  useEffect(() => {
    document.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => document.removeEventListener("resize", resizeHandler);
  }, [resizeHandler]);

  const resetClickHandler = () => {
    setPlaying(false);
    createCluster(globalp5);
    setPlaying(true);
  };

  const SmoothAniClickHandler = () => {
    setPlaying(false);

    custers?.forEach((c) =>
      c.forEach((p) => (p.smoothAnimation = !smoothAnimation))
    );
    setSmoothAnimation(!smoothAnimation);
    setPlaying(true);
  };

  const clusterNumberChangeHandler = (e: any) => {
    setPlaying(false);
    setClusterNumbers(Number(e));
    createCluster(globalp5);
    setPlaying(true);
  };

  const createCluster = (p5: p5Types) => {
    var tempCulsters = [];

    for (var c = 0; c < clusterNumbers; c++) {
      let points = [];
      let clusterColor = p5.color(
        p5.random(0, 255),
        p5.random(0, 255),
        p5.random(0, 255)
      );

      for (var i = 0; i < clusterSize; i++) {
        points.push(
          new Point(p5, {
            canvasHeight,
            canvasWidth,
            color: clusterColor,
            margin,
            maxSpeed,
            minSpeed,
            sizeMax,
            sizeMin,
            smoothAnimation,
          } as PointConfig)
        );
      }

      // console.log("points: ", points);

      for (var j = 0; j < clusterSize; j++) {
        let partIndex: number[] = [];
        while (partIndex.length < connections) {
          var pos = p5.round(p5.random(0, clusterSize - 1));
          if (pos === j) {
            continue;
          }

          if (!partIndex.includes(pos)) {
            partIndex.push(pos);
            // console.log("con", points[pos], "pos: ", pos);
            points[j].partners.push(points[pos]);
          }
        }
        //console.log(points[j]);
      }
      tempCulsters.push(points);
    }

    setCusters(tempCulsters);
  };

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setGlobalp5(p5);
    bgColor = p5.random(0, 255);
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    createCluster(p5);
    // console.log("setup!");
  };

  const reducer = (accumulator: number, currentValue: Point[][]) =>
    accumulator + currentValue.length;

  const draw = (p5: p5Types) => {
    if (
      playing &&
      custers !== null &&
      custers.length === clusterNumbers &&
      custers[0].length === clusterSize
    ) {
      p5.background(bgColor);
      for (var c = 0; c < clusterNumbers; c++) {
        for (var i = 0; i < clusterSize; i++) {
          custers[c][i]?.move();
        }
      }
    } else {
      p5.text("afspilning stoppet", canvasWidth / 2, canvasHeight / 2);
    }
  };

  return (
    <div className="container">
      <div className="options">
        <button onClick={resetClickHandler}>Reset</button>
        <button onClick={SmoothAniClickHandler}>
          Smooth animation : {smoothAnimation ? "ON" : "OFF"}
        </button>
        <div className="slidecontainer">
          <p>Max movment speed of nodes : {maxSpeed}</p>
          <input
            type="range"
            min={minSpeed}
            max="50"
            value={maxSpeed}
            onChange={(e) => setMaxSpeed(Number(e.target.value))}
          />
          <p>Min movment speed of nodes : {minSpeed}</p>
          <input
            type="range"
            min="0"
            max={maxSpeed}
            value={minSpeed}
            onChange={(e) => setMinSpeed(Number(e.target.value))}
          />

          <p>Max node size : {sizeMax}</p>
          <input
            type="range"
            min={sizeMin}
            max="50"
            value={sizeMax}
            onChange={(e) => setSizeMax(Number(e.target.value))}
          />
          <p>Min node size : {sizeMin}</p>
          <input
            type="range"
            min="0"
            max={sizeMax}
            value={sizeMin}
            onChange={(e) => setSizeMin(Number(e.target.value))}
          />
          <p>Margin : {margin}</p>
          <input
            type="range"
            min="0"
            max="200"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
          <p>Connections per Node: {connections}</p>
          <input
            type="range"
            min="0"
            max={clusterSize - 1}
            value={connections}
            onChange={(e) => setConnections(Number(e.target.value))}
          />
        </div>
        <div>
          <p>Nodes in group: {clusterNumbers}</p>
          <input
            type="range"
            min="1"
            max="40"
            value={clusterNumbers}
            onChange={(e) => clusterNumberChangeHandler(Number(e.target.value))}
          />
          <p>Cluster size: {clusterSize}</p>
          <input
            type="range"
            min="3"
            max="40"
            value={clusterSize}
            onChange={(e) => setClusterSize(Number(e.target.value))}
          />
        </div>
        <p>number of clusters : {custers?.length}</p>
        <p>number of nodes in cluster {}</p>
      </div>
      <div className="canvas">
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  );
};

export { P5 };
