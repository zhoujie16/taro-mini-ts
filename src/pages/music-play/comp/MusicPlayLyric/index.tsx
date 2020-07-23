import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IProps {
  songLyric: string;
}

interface IState {}

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
      <View className="music-play-lyric">
        <View className="music-play-lyric__inner">{this.props.songLyric}</View>
      </View>
    );
  }
}
