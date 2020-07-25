import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  playStatus: any;
  playBtnClicnFn: any;
  preBtnClickFn: any;
  nextBtnClickFn: any;
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
    return (
      <View className="music-play-bottom">
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
    );
  }
}
