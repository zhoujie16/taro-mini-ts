import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtSlider } from "taro-ui";

interface IProps {
  currentTime: number;
  durationTime: number;
  sliderValue: number;
  playStatus: any;
  playBtnClicnFn: any;
  preBtnClickFn: any;
  nextBtnClickFn: any;
  sliderOnChange: any;
  sliderOnChanging: any;
}

export default function (props: IProps) {
  function computeTime(count) {
    function PrefixZero(num, n) {
      return (Array(n).join("0") + num).slice(-n);
    }
    const _count: number = parseInt(count);
    const m = (_count / 60).toFixed(0);
    const s = _count % 60;
    return `${PrefixZero(m, 2)}:${PrefixZero(s, 2)}`;
  }

  const {
    playStatus,
    currentTime,
    durationTime,
    sliderValue,
    sliderOnChange,
    sliderOnChanging,
    preBtnClickFn,
    playBtnClicnFn,
    nextBtnClickFn,
  } = props;

  let playClassName = "";
  if (playStatus === "play") {
    playClassName = "music-play-bottom__center--pause";
  } else if (playStatus === "stop") {
    playClassName = "music-play-bottom__center--play";
  } else if (playStatus === "wait") {
    playClassName = "music-play-bottom__center--wait";
  }

  return (
    <View className="music-play-bottom">
      <View className="music-play-slider">
        <Text className="music-play-slider__text music-play-slider__text--left">
          {computeTime(currentTime)}
        </Text>
        <AtSlider
          value={sliderValue}
          className="music-play-slider__slider"
          activeColor="#7d7d7d"
          backgroundColor="#444444"
          blockColor="#ffffff"
          blockSize={10}
          onChange={sliderOnChange}
          onChanging={sliderOnChanging}
        ></AtSlider>
        <Text className="music-play-slider__text music-play-slider__text--right">
          {computeTime(durationTime)}
        </Text>
      </View>
      <View className="music-play-bottom__inner">
        <View className="music-play-bottom__left"></View>
        <View className="music-play-bottom__center">
          <View
            className="music-play-bottom__center--pre"
            onClick={() => preBtnClickFn()}
          ></View>
          <View
            className={`music-play-bottom__center ${playClassName}`}
            onClick={() => playBtnClicnFn()}
          ></View>
          <View
            className="music-play-bottom__center--next"
            onClick={() => nextBtnClickFn()}
          ></View>
        </View>
        <View className="music-play-bottom__right"></View>
      </View>
    </View>
  );
}
