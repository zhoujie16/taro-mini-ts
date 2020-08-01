import React, { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import HeaderPanel from "@/pages/rank-list-detail/comp/HeaderPanel";
import MusicList from "@/pages/rank-list-detail/comp/MusicList";
import { Ajax_playlist_detail } from "@/api/index.ts";
import { AtActivityIndicator } from "taro-ui";

const RankListDetail = () => {
  const routerParams = useRouter().params;
  console.log("routerParams", routerParams);

  const [playlist, setPlaylist] = useState({});
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    initPage();
  }, [0]);

  async function initPage(): Promise<void> {
    const [err, res] = await Ajax_playlist_detail({
      id: routerParams.id,
    });
    if (err) return;
    const { playlist } = res;
    setPlaylist(playlist);
    setTracks(playlist.tracks);
  }

  function goMusicPlayPage(curIndex): void {
    console.log("播放按钮点击", routerParams.id, curIndex);
    // 去播放器页面
    Taro.navigateTo({
      url: `/pages/music-play/index?id=${routerParams.id}&num=${curIndex}`,
    });
  }

  if (tracks.length === 0) {
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
      <MusicList tracks={tracks} cellClickFn={goMusicPlayPage}></MusicList>
    </View>
  );
};

export default RankListDetail;
