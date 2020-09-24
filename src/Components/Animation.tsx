import React, { useState } from "react";
import Sketch from "react-p5";
import styled from "styled-components";
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

  //let clusterSize = 5;
  // let clusterNumbers = 1;
  let connections = 2;
  let margin = 100;
  let canvasWidth = 800;
  let canvasHeight = 500;
  //let smoothAnimation = true;
  // let maxSpeed = 3;
  let minSpeed = 0;
  let sizeMax = 20;
  let sizeMin = 10;
  let bgColor: number = 10;

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

  const draw = (p5: p5Types) => {
    if (playing && custers !== null) {
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

  const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
  `;

  const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
  `;

  const Thumb = (props: any, state: any) => (
    <StyledThumb {...props}>{state.valueNow}</StyledThumb>
  );

  const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${(props: any) =>
      props.index === 2 ? "#f00" : props.index === 1 ? "#0f0" : "#ddd"};
    border-radius: 999px;
  `;

  const Track = (props: any, state: any) => (
    <StyledTrack {...props} index={state.index} />
  );

  return (
    <>
      <button onClick={resetClickHandler}>Reset</button>
      <button onClick={SmoothAniClickHandler}>
        Smooth animation : {smoothAnimation ? "ON" : "OFF"}
      </button>
      <div className="slidecontainer">
        <p>Default range slider:</p>
        <input
          type="range"
          min="0"
          max="100"
          value={maxSpeed}
          onChange={(e) => setMaxSpeed(Number(e.target.value))}
        />
      </div>
      <Sketch setup={setup} draw={draw} />
    </>
  );
};

export { P5 };
