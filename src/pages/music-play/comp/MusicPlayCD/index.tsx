import React, { Component } from "react";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  playStatus: any;
  songTracks: any[];
  currentIndex: number;
  onChange: any;
}

export default class Index extends Component<IProps, IState> {
  state: any = {};
  constructor(props: IProps) {
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
    try {
    } catch (error) {}
  }

  render() {
    const arr = this.props.songTracks.map((x) => {
      return x.al.picUrl;
    });
    if (arr.length === 0) return "";
    return (
      <View className="music-paly-content">
        <View className="music-play__cd-wrap">
          {/* 撑开空间的 */}
          <View className="music-play__span"></View>
          {/* 杆子 */}
          <View
            className={
              this.props.playStatus === "stop"
                ? "music-play__needle music-play__needle-pause"
                : "music-play__needle music-play__needle-play"
            }
          ></View>
          {/* 旋转的CD */}
          <View className="music-play__cd-swiper-wrap">
            <View className="music-play__cd-border"></View>
            <Swiper
              className="music-play__cd-swiper"
              current={this.props.currentIndex}
              onChange={this.props.onChange}
            >
              {arr.map((picUrl, index) => {
                const currentIndex = this.props.currentIndex;
                const isShowPicUrl =
                  currentIndex === index ||
                  currentIndex === index - 1 ||
                  currentIndex === index + 1;
                return (
                  <SwiperItem
                    className="music-play__cd-swiper-item"
                    key={index}
                  >
                    <View
                      className={`music-play__cd ${
                        this.props.playStatus === "stop"
                          ? "music-play__cd-play-action music-play__cd-play-action-pause"
                          : "music-play__cd-play-action"
                      }`}
                    >
                      <View className="music-play__cd-bg"></View>
                      <Image
                        className="music-play__cd-cover-img"
                        mode="widthFix"
                        src={isShowPicUrl ? picUrl : ""}
                      ></Image>
                    </View>
                  </SwiperItem>
                );
              })}
            </Swiper>
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
