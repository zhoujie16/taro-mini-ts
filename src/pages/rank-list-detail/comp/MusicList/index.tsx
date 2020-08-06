import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import MusicListNav from "@/pages/rank-list-detail/comp/MusicListNav";
import MusicListCell from "@/pages/rank-list-detail/comp/MusicListCell";

interface IProps {
  tracks: any[];
  cellClickFn: any;
}

export default function (props: IProps) {
  return (
    <View className="music-list">
      <MusicListNav curLength={props.tracks.length}></MusicListNav>
      <View className="music-list__list">
        {props.tracks.map((item, index) => (
          <MusicListCell
            key={index}
            musicInfo={item}
            curIndex={index + 1}
            cellClickFn={props.cellClickFn}
          ></MusicListCell>
        ))}
      </View>
    </View>
  );
}
