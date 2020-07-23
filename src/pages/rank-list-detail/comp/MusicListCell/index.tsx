import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IProps {
  musicInfo: any;
  curIndex: number;
}

export default class Index extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  public get al(): any {
    return this.props.musicInfo.al;
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

  // 播放按钮点击
  cellPlayBtnClick = (): void => {
    console.log("播放按钮点击", this.props.musicInfo);
    // 去播放器页面
    Taro.navigateTo({
      url: `/pages/music-play/index?id=${this.props.musicInfo.id}`,
    });
  };

  filterSubTitle = (): string => {
    const musicInfo = this.props.musicInfo;
    const ar = musicInfo.ar.map((x) => x.name).join(",");
    const al = musicInfo.al.name;
    return `${ar} - ${al}`;
  };

  render() {
    return (
      <View className="music-list-cell">
        <View className="music-list-cell__inner">
          <View className="music-list-cell__num">{this.props.curIndex}</View>
          <View className="music-list-cell__info">
            <View className="music-list-cell__name">
              {this.props.musicInfo.name}
            </View>
            <View className="music-list-cell__desc">
              {this.filterSubTitle()}
            </View>
          </View>
          <View
            className="music-list-cell__play"
            onClick={() => this.cellPlayBtnClick()}
          ></View>
        </View>
      </View>
    );
  }
}
