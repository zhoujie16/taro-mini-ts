import React, { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import {
  Ajax_lyric,
  Ajax_song_url,
  Ajax_playlist_detail,
} from "@/api/index.ts";
import MusicPlayBottom from "./comp/MusicPlayBottom";
import MusicPlayCD from "./comp/MusicPlayCD";
import MusicPlayLyric from "./comp/MusicPlayLyric";
import MusicPlayHeader from "./comp/MusicPlayHeader";
import LyricContext from "./comp/MusicPlayLyric/lyric-parser";
import { AtActivityIndicator } from "taro-ui";

const MusicPlay = () => {
  const routerParams: any = useRouter().params; // 路由传参
  console.log("routerParams", routerParams);
  let innerAudioContext: any = null; // 音乐播放上下文
  let songLyricLines: any[] = []; // 歌词格式化的数组
  let timer_play: any = null; // 防抖定时器
  let isSliding: boolean = false; // 是否在拖动进度条

  const [playStatus, set_playStatus] = useState("stop"); // 播放状态 播放 play  暂停 stop  等待 wait
  const [currentTime, set_currentTime] = useState(0); // 当前进度 （进度条用）
  const [durationTime, set_durationTime] = useState(0); // 总进度 (进度条用)
  const [sliderValue, set_sliderValue] = useState(0); // 进度条值 (进度条用)
  const [lines, set_lines] = useState([]); // 歌词面板用的歌词 (歌词面板)
  const [top, set_top] = useState(0); // 歌词面板滚动距离 (歌词面板)
  const [cdAndLyricFlag, set_cdAndLyricFlag] = useState(true); // 唱片 歌词 切换标识
  const [songTracks, set_songTracks] = useState([]); // 播放列表
  const [currentIndex, set_currentIndex] = useState(0); //当前播放序号
  const [currentSong, set_currentSong] = useState({}); // 当前播放歌曲

  useEffect(() => {
    createInnerAudioContext();
    initPage();
    return () => {
      innerAudioContext.destroy();
    };
  }, [0]);
 
  async function initPage(): Promise<void> {
    // 获取播放列表
    const [err_songTracks, res_songTracks] = await Ajax_playlist_detail({
      id: routerParams.id,
    });
    if (err_songTracks) return;
    const songTracks = res_songTracks.playlist.tracks;
    console.log("songTracks", songTracks);
    // 设置播放列表
    set_songTracks(songTracks);
    // 播放
    const num = Number(routerParams.num);
    setCurrentSong(num, true);
  }
  // 创建播放器
  function createInnerAudioContext() {
    innerAudioContext = Taro.createInnerAudioContext();

    // 音频进入可以播放状态
    innerAudioContext.onCanplay(() => {
      console.log("onCanplay");
      // 总时间
      const { duration } = innerAudioContext;
      set_durationTime(duration);
    });

    // 音频播放事件
    innerAudioContext.onPlay(() => {
      console.log("onPlay", innerAudioContext);
      set_playStatus("play");
    });

    // 音频暂停事件
    innerAudioContext.onPause(() => {
      console.log("onPause");
      set_playStatus("stop");
    });

    // 音频停止事件
    innerAudioContext.onStop(() => {
      console.log("onStop");
      set_playStatus("stop");
    });

    // 音频自然播放结束事件
    innerAudioContext.onEnded(() => {
      console.log("onEnded");
      set_playStatus("stop");
      nextBtnClick();
    });

    // 音频播放进度更新事件 包括手动更新
    innerAudioContext.onTimeUpdate(() => {
      const { currentTime } = innerAudioContext;
      // console.log("onTimeUpdate", currentTime);
      if (currentTime === 0) {
        return;
      }
      setLyricAndSliderState(currentTime);
      set_playStatus("play");
    });

    // 音频加载中事件，当音频因为数据不足
    innerAudioContext.onWaiting(() => {
      console.log("onWaiting");
      set_playStatus("wait");
    });

    innerAudioContext.onSeeking(() => {
      console.log("onSeeking");
      set_playStatus("wait");
    });

    innerAudioContext.onSeeked(() => {
      console.log("onSeeked");
    });

    // 音频播放错误事件
    innerAudioContext.onError((res) => {
      console.error("onError", res);
      set_playStatus("stop");
    });
  }

  // 切歌 设置当前播放的歌曲
  async function setCurrentSong(
    currentIndex: number, // 序号
    isAutoPlay?: boolean // 是否立即播放
  ): Promise<void> {
    const currentSong = songTracks[currentIndex];
    set_currentIndex(currentIndex);
    set_currentSong(currentSong); 
    // 获取 歌曲 歌词
    const [err_lyric, res_lyric] = await Ajax_lyric({
      id: currentSong.id,
    });
    if (err_lyric) return;
    console.log("res_lyric", res_lyric);
    const songLyric = res_lyric.lrc.lyric;

    // 解析歌词
    const lyricContext = new LyricContext(songLyric, () => {});
    songLyricLines = lyricContext.lines;

    setLyricAndSliderState(0);

    // 获取 歌曲 播放 链接
    const [err_song_url, res_song_url] = await Ajax_song_url({
      id: currentSong.id,
    });
    if (err_song_url) return;
    console.log("res_song_url", res_song_url);
    const songUrl = res_song_url.data[0].url;

    // 设置播放url
    innerAudioContext.src = songUrl;

    if (isAutoPlay) {
      playMusic();
    }
  }
  // 播放按钮点击事件
  function playBtnClick() {
    if (playStatus === "play") {
      pauseMusic();
    } else if (playStatus === "stop") {
      playMusic();
    }
  }
  // 上一首
  function preBtnClick(): void {
    console.log("上一首");
    if (currentIndex === 0) return;
    // 当前播放的停止
    pauseMusic();
    setCurrentSong(currentIndex - 1, true);
  }

  // 下一首
  function nextBtnClick(): void {
    console.log("下一首");
    if (currentIndex === songTracks.length - 1) return;
    // 当前播放的停止
    pauseMusic();
    setCurrentSong(currentIndex + 1, true);
  }
  function playMusic(): void {
    // 防抖
    if (timer_play) {
      clearTimeout(timer_play);
      timer_play = null;
    }
    timer_play = setTimeout(() => {
      innerAudioContext.play();
    }, 400);
  }

  function pauseMusic(): void {
    innerAudioContext.pause();
    set_playStatus("stop");
  }

  // 设置 歌词面板数据状态 和 滑块状态
  function setLyricAndSliderState(currentTime: number): void {
    let top = 0;
    const lines: any[] = songLyricLines.map((x, index) => ({
      ...x,
      index,
      active: false,
    }));
    lines.forEach((x) => (x.active = false));
    const lineItemIndex = lines.findIndex((item) => {
      return item.time >= currentTime * 1000;
    });
    if (lineItemIndex > 0) {
      const lineItem = lines[lineItemIndex - 1];
      lineItem.active = true;
      top = lineItem.index * 40;
      // console.log(lineItem);
    }
    if (!isSliding) {
      const sliderValue = (currentTime / durationTime) * 100;
      set_lines(lines);
      set_top(top);
      set_currentTime(currentTime);
      set_sliderValue(sliderValue);
    }
  }

  function musicPlayBodyClick(): void {
    console.log("musicPlayBodyClick");
    set_cdAndLyricFlag(!cdAndLyricFlag);
  }

  function onChange(e) {
    console.log("onChange", e.detail);
    setCurrentSong(e.detail.current, true);
  }

  // 滑块事件
  function sliderOnChange(value) {
    isSliding = false;
    console.warn("sliderOnChange", value);
    const seekTime = durationTime * (value / 100);
    // 指定位置
    innerAudioContext.seek(seekTime);
    playMusic();
  }

  function sliderOnChanging(value) {
    isSliding = true;
    console.warn("sliderOnChanging", value);
    const currentTime = durationTime * (value / 100);
    set_sliderValue(value);
    set_currentTime(currentTime);
  }
  if (!currentSong || !currentSong.id) {
    return (
      <View className="music-play-page-wrap">
        <AtActivityIndicator
          mode="center"
          content="加载中..."
          size={32}
        ></AtActivityIndicator>
      </View>
    );
  }
  return (
    <View className="music-play-page-wrap">
      <View className="music-play__header">
        <MusicPlayHeader currentSong={currentSong}></MusicPlayHeader>
      </View>
      <View
        className="music-play__content"
        onClick={() => musicPlayBodyClick()}
      >
        {/* 音乐CD */}
        <View
          className={
            cdAndLyricFlag
              ? "music-play__content__inner music-play__content__inner--cd"
              : "music-play__content__inner"
          }
        >
          <MusicPlayCD
            songTracks={songTracks}
            currentIndex={currentIndex}
            playStatus={playStatus}
            onChange={onChange}
          ></MusicPlayCD>
        </View>
        {/* 歌词 */}
        <View
          className={
            cdAndLyricFlag
              ? "music-play__content__inner"
              : "music-play__content__inner music-play__content__inner--lyr"
          }
        >
          <MusicPlayLyric top={top} lines={lines}></MusicPlayLyric>
        </View>
      </View>
      <View className="music-play__bottom">
        <MusicPlayBottom
          currentTime={currentTime}
          durationTime={durationTime}
          sliderValue={sliderValue}
          playStatus={playStatus}
          playBtnClicnFn={playBtnClick}
          preBtnClickFn={preBtnClick}
          nextBtnClickFn={nextBtnClick}
          sliderOnChange={sliderOnChange}
          sliderOnChanging={sliderOnChanging}
        ></MusicPlayBottom>
      </View>
      {/* <View className="music-play__bottom-span"></View> */}
    </View>
  );
};

export default MusicPlay;
