import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

interface IProps {
  currentSong: any;
}

const MusicPlayHeader = (props: IProps) => {
  // 返回按钮事件
  function bacnBtnClick(): void {
    Taro.navigateBack();
  }
  const { currentSong } = props;
  let name = "";
  let ar = "";
  try {
    name = currentSong.name;
    ar = currentSong.ar.map((x: any) => x.name).join(",");
  } catch (error) {}

  if (ar === "" || name === "") return "";
  return (
    <View className="music-paly-header">
      <View className="music-paly-header__left" onClick={bacnBtnClick}></View>
      <View className="music-paly-header__title">
        <Text className="music-paly-header__al-name">{name}</Text>
        <Text className="music-paly-header__ar-name">{ar}</Text>
      </View>
      <View className="music-paly-header__right"></View>
    </View>
  );
};

export default MusicPlayHeader;
