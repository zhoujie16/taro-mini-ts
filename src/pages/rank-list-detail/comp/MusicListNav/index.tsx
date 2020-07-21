import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IProps {
  curLength: number;
}

export default class Index extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("MusicList componentWillMount");
  }

  componentDidMount() {
    console.log("MusicList componentDidMount");
  }

  componentWillUnmount() {
    console.log("MusicList componentWillUnmount");
  }

  render() {
    return (
      <View className="music-list-nav">
        <View className="music-list-nav__play"></View>
        <View className="music-list-nav__title">播放全部</View>
        <View className="music-list-nav__sub-title">
          ({`共${this.props.curLength}首`})
        </View>
      </View>
    );
  }
}
