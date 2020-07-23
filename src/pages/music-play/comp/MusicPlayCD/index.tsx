import React, { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  isPlay: any;
  songDetail: any;
}

export default class Index extends Component<IProps, IState> {
  state: any = {};
  constructor(props: IProps) {
    super(props);
  }

  public get picUrl(): string {
    let picUrl = "";
    try {
      picUrl = this.props.songDetail.al.picUrl;
    } catch (error) {
      console.log(error);
    }
    return picUrl;
  }

  componentWillMount() {
    console.log(" componentWillMount");
  }

  componentDidMount() {
    console.log(" componentDidMount");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount");
    try {
    } catch (error) {}
  }

  render() {
    return (
      <View className="music-paly-content">
        <View className="music-play__cd-wrap">
          {/* 撑开空间的 */}
          <View className="music-play__span"></View>
          {/* 杆子 */}
          <View
            className={
              this.props.isPlay
                ? "music-play__needle music-play__needle-play"
                : "music-play__needle music-play__needle-pause"
            }
          ></View>
          {/* 旋转的CD */}
          <View
            className={`music-play__cd ${
              this.props.isPlay
                ? "music-play__cd-play-action"
                : "music-play__cd-play-action music-play__cd-play-action-pause"
            }`}
          >
            <View className="music-play__cd-bg"></View>
            <Image
              className="music-play__cd-cover-img"
              mode="widthFix"
              src={this.picUrl}
            ></Image>
          </View>
        </View>

        {/* 操作栏 */}
        <View className="music-play__menu">
          <View className="music-play__menu-item love"></View>
          <View className="music-play__menu-item dld"></View>
          <View className="music-play__menu-item mic"></View>
          <View className="music-play__menu-item cmt"></View>
          <View className="music-play__menu-item more"></View>
        </View>
      </View>
    );
  }
}
