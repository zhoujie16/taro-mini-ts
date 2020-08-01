import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

interface IProps {
  musicInfo: any;
  curIndex: number;
  cellClickFn: any;
}

const MusicListCell = (props: IProps) => {
  const { curIndex, musicInfo, cellClickFn } = props;

  function filterSubTitle(): string {
    const ar = musicInfo.ar.map((x) => x.name).join(",");
    const al = musicInfo.al.name;
    return `${ar} - ${al}`;
  }

  return (
    <View className="music-list-cell" onClick={() => cellClickFn(curIndex - 1)}>
      <View className="music-list-cell__inner">
        <View className="music-list-cell__num">{curIndex}</View>
        <View className="music-list-cell__info">
          <View className="music-list-cell__name">{musicInfo.name}</View>
          <View className="music-list-cell__desc">{filterSubTitle()}</View>
        </View>
        <View className="music-list-cell__play"></View>
      </View>
    </View>
  );
};

export default MusicListCell;
