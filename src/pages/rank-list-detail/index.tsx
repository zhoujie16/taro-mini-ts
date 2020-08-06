import React from "react";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import HeaderPanel from "@/pages/rank-list-detail/comp/HeaderPanel";
import MusicList from "@/pages/rank-list-detail/comp/MusicList";
import { AtActivityIndicator } from "taro-ui";
import { useGetPlaylist } from "./hooks";

export default function () {
  const routerParams = useRouter().params;
  const playlist = useGetPlaylist();
  function goMusicPlayPage(curIndex): void {
    console.log("播放按钮点击", routerParams.id, curIndex);
    // 去播放器页面
    Taro.navigateTo({
      url: `/pages/music-play/index?id=${routerParams.id}&num=${curIndex}`,
    });
  }

  if (!playlist.id) {
    return (
      <View className="rank-list-page-wrap">
        <AtActivityIndicator
          mode="center"
          content="加载中..."
          size={32}
        ></AtActivityIndicator>
      </View>
    );
  }
  return (
    <View className="rank-list-detail-page-wrap">
      <HeaderPanel playlist={playlist}></HeaderPanel>
      <MusicList
        tracks={playlist.tracks}
        cellClickFn={goMusicPlayPage}
      ></MusicList>
    </View>
  );
}
