import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  isPlay: any;
  playBtnClicnFn: any;
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
    return (
      <View className="music-play-bottom">
        <View className="music-play-bottom__left"></View>
        <View className="music-play-bottom__center">
          <View className="music-play-bottom__center--pre"></View>
          <View
            className={`music-play-bottom__center ${
              this.props.isPlay
                ? "music-play-bottom__center--pause"
                : "music-play-bottom__center--play"
            }`}
            onClick={() => this.props.playBtnClicnFn()}
          ></View>
          <View className="music-play-bottom__center--next"></View>
        </View>
        <View className="music-play-bottom__right"></View>
      </View>
    );
  }
}
