import React from "react";
import { View, ScrollView } from "@tarojs/components";
import "./index.scss";

interface IProps {
  lines: any[];
  top: number;
}

export default function (props: IProps) {
  const { top, lines } = props;
  return (
    <View className="music-play-lyric">
      <View className="music-play-lyric__inner">
        <ScrollView
          className="music-play-lyric__inner-lyric-scroll"
          scrollY
          scrollWithAnimation
          scrollTop={top}
        >
          <View className="music-play-lyric__inner-lyric">
            {lines.map((item, index) => {
              return (
                <View
                  className={
                    item.active
                      ? "music-play-lyric__line music-play-lyric__line--active"
                      : "music-play-lyric__line"
                  }
                  key={index}
                >
                  {item.txt}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
