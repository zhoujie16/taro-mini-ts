import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";
import { AtSlider } from "taro-ui";

interface IState {}

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

export default class Index extends Component<IProps, IState> {
  state = {};
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(" componentWillMount");
  }

  componentDidMount() {
    console.log(" componentDidMount");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount");
  }

  computeTime(count) {
    function PrefixZero(num, n) {
      return (Array(n).join("0") + num).slice(-n);
    }
    const _count: number = parseInt(count);
    const m = (_count / 60).toFixed(0);
    const s = _count % 60;
    return `${PrefixZero(m, 2)}:${PrefixZero(s, 2)}`;
  }
  render() {
    let playClassName = "";
    const playStatus = this.props.playStatus;
    if (playStatus === "play") {
      playClassName = "music-play-bottom__center--pause";
    } else if (playStatus === "stop") {
      playClassName = "music-play-bottom__center--play";
    } else if (playStatus === "wait") {
      playClassName = "music-play-bottom__center--wait";
    }
    const { currentTime, durationTime, sliderValue } = this.props;
    return (
      <View className="music-play-bottom">
        <View className="music-play-slider">
          <Text className="music-play-slider__text music-play-slider__text--left">
            {this.computeTime(currentTime)}
          </Text>
          <AtSlider
            value={sliderValue}
            className="music-play-slider__slider"
            activeColor="#7d7d7d"
            backgroundColor="#444444"
            blockColor="#ffffff"
            blockSize={10}
            onChange={this.props.sliderOnChange}
            onChanging={this.props.sliderOnChanging}
          ></AtSlider>
          <Text className="music-play-slider__text music-play-slider__text--right">
            {this.computeTime(durationTime)}
          </Text>
        </View>
        <View className="music-play-bottom__inner">
          <View className="music-play-bottom__left"></View>
          <View className="music-play-bottom__center">
            <View
              className="music-play-bottom__center--pre"
              onClick={() => this.props.preBtnClickFn()}
            ></View>
            <View
              className={`music-play-bottom__center ${playClassName}`}
              onClick={() => this.props.playBtnClicnFn()}
            ></View>
            <View
              className="music-play-bottom__center--next"
              onClick={() => this.props.nextBtnClickFn()}
            ></View>
          </View>
          <View className="music-play-bottom__right"></View>
        </View>
      </View>
    );
  }
}
