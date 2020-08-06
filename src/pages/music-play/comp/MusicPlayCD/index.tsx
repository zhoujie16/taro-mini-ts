import React from "react";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";

interface IProps {
  playStatus: any;
  songTracks: any[];
  currentIndex: number;
  onChange: any;
}

export default function (props: IProps) {
  const { playStatus, songTracks, currentIndex, onChange } = props;
  const arr = songTracks.map((x) => {
    return x.al.picUrl;
  });
  if (arr.length === 0) return <View></View>;
  return (
    <View className="music-paly-content">
      <View className="music-play__cd-wrap">
        {/* 撑开空间的 */}
        <View className="music-play__span"></View>
        {/* 杆子 */}
        <View
          className={
            playStatus === "stop"
              ? "music-play__needle music-play__needle-pause"
              : "music-play__needle music-play__needle-play"
          }
        ></View>
        {/* 旋转的CD */}
        <View className="music-play__cd-swiper-wrap">
          <View className="music-play__cd-border"></View>
          <Swiper
            className="music-play__cd-swiper"
            current={currentIndex}
            onChange={onChange}
          >
            {arr.map((picUrl, index) => {
              // 始终只显示3个 且 只有当前播放的CD有旋转动画
              const isShowCD =
                currentIndex === index ||
                currentIndex === index - 1 ||
                currentIndex === index + 1;
              const isCurrentCD = currentIndex === index;
              if (!isShowCD) {
                return (
                  <SwiperItem
                    className="music-play__cd-swiper-item"
                    key={index}
                  >
                    <View className={`music-play__cd`}></View>
                  </SwiperItem>
                );
              }
              return (
                <SwiperItem className="music-play__cd-swiper-item" key={index}>
                  <View
                    className={`music-play__cd ${
                      playStatus === "stop"
                        ? "music-play__cd-play-action music-play__cd-play-action-pause"
                        : isCurrentCD
                        ? "music-play__cd-play-action"
                        : ""
                    }`}
                  >
                    <View className="music-play__cd-bg"></View>
                    <Image
                      className="music-play__cd-cover-img"
                      mode="widthFix"
                      src={picUrl}
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
