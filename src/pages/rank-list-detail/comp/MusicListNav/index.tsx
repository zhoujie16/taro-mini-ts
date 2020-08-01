import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

interface IProps {
  curLength: number;
}

const MusicListNav = (props: IProps) => {
  const { curLength } = props;
  return (
    <View className="music-list-nav">
      <View className="music-list-nav__play"></View>
      <View className="music-list-nav__title">播放全部</View>
      <View className="music-list-nav__sub-title">({`共${curLength}首`})</View>
    </View>
  );
};

export default MusicListNav;
