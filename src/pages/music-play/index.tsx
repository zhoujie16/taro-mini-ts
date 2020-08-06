import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "@tarojs/taro";
import { AtActivityIndicator } from "taro-ui";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import MusicPlayBottom from "./comp/MusicPlayBottom";
import MusicPlayCD from "./comp/MusicPlayCD";
import MusicPlayLyric from "./comp/MusicPlayLyric";
import MusicPlayHeader from "./comp/MusicPlayHeader";
import {
  useGetSongTracks,
  useGetCurrentSong,
  useGetLyric,
  useGetSongUrl,
  useGetLyricAndSliderState,
} from "./hooks";

export default function () {
  const routerParams: any = useRouter().params; // 路由传参
  const innerAudioContext: any = useRef(null); // 音乐播放上下文
  const timer_play: any = useRef(null); // 防抖定时器
  const isSliding_ref = useRef(false); // 是否在拖动进度条
  const [playStatus, set_playStatus] = useState("stop"); // 播放状态 播放 play  暂停 stop  等待 wait
  const [durationTime, set_durationTime] = useState(0); // 总进度 (进度条用)
  const [sliderValue, set_sliderValue] = useState(0); // 进度条值 (进度条用)
  const [cdAndLyricFlag, set_cdAndLyricFlag] = useState(true); // 唱片 歌词 切换标识
  const songTracks = useGetSongTracks(); // 播放列表
  const [currentIndex, set_currentIndex] = useState(0); //当前播放序号
  const currentSong = useGetCurrentSong(songTracks, currentIndex); // 当前播放的歌曲
  const [currentTime, set_currentTime] = useState(0);
  const songLyricLines = useGetLyric(currentSong); // 歌词格式化的数组
  const songUrl = useGetSongUrl(currentSong); // 当前播放歌曲url

  // 歌词面板数据 滚动距离 滑块值
  const { lines, top } = useGetLyricAndSliderState(songLyricLines, currentTime);

  useEffect(() => {
    createInnerAudioContext();
    return () => {
      innerAudioContext.current.destroy();
    };
  }, []);

  useEffect(() => {
    innerAudioContext.current.src = songUrl;
    playMusic();
  }, [songUrl]);

  useEffect(() => {
    const num = Number(routerParams.num);
    set_currentIndex(num);
  }, [songTracks]);

  useEffect(() => {
    const sliderValue = (currentTime / durationTime) * 100;
    set_sliderValue(sliderValue);
  }, [currentTime]);

  // 创建播放器
  function createInnerAudioContext() {
    innerAudioContext.current = Taro.createInnerAudioContext();

    // 音频进入可以播放状态
    innerAudioContext.current.onCanplay(() => {
      console.log("onCanplay");
      // 总时间
      const { duration } = innerAudioContext.current;
      set_durationTime(duration);
    });

    // 音频播放事件
    innerAudioContext.current.onPlay(() => {
      console.log("onPlay", innerAudioContext);
      set_playStatus("play");
    });

    // 音频暂停事件
    innerAudioContext.current.onPause(() => {
      console.log("onPause");
      set_playStatus("stop");
    });

    // 音频停止事件
    innerAudioContext.current.onStop(() => {
      console.log("onStop");
      set_playStatus("stop");
    });

    // 音频自然播放结束事件
    innerAudioContext.current.onEnded(() => {
      console.log("onEnded");
      set_playStatus("stop");
      nextBtnClick();
    });
    console.log(isSliding_ref.current);
    // 音频播放进度更新事件 包括手动更新
    innerAudioContext.current.onTimeUpdate(() => {
      const { currentTime } = innerAudioContext.current;
      if (currentTime === 0) {
        return;
      }
      if (!isSliding_ref.current) {
        set_currentTime(currentTime);
      }
      set_playStatus("play");
    });

    // 音频加载中事件，当音频因为数据不足
    innerAudioContext.current.onWaiting(() => {
      console.log("onWaiting");
      set_playStatus("wait");
    });

    innerAudioContext.current.onSeeking(() => {
      console.log("onSeeking");
      set_playStatus("wait");
    });

    innerAudioContext.current.onSeeked(() => {
      console.log("onSeeked");
    });

    // 音频播放错误事件
    innerAudioContext.current.onError((res) => {
      console.error("onError", res);
      set_playStatus("stop");
    });
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
    console.log("上一首", songTracks.length, currentIndex);
    if (currentIndex === 0) return;
    // 当前播放的停止
    pauseMusic();
    set_currentIndex(currentIndex - 1);
  }

  // 下一首
  function nextBtnClick(): void {
    console.log("下一首", songTracks.length, currentIndex);
    if (currentIndex === songTracks.length - 1) return;
    // 当前播放的停止
    pauseMusic();
    set_currentIndex(currentIndex + 1);
  }

  // 播放音乐
  function playMusic(): void {
    // 防抖
    if (timer_play.current) {
      clearTimeout(timer_play.current);
      timer_play.current = null;
    }
    timer_play.current = setTimeout(() => {
      innerAudioContext.current.play();
    }, 400);
  }

  // 暂停播放
  function pauseMusic(): void {
    innerAudioContext.current.pause();
    set_playStatus("stop");
  }

  function musicPlayBodyClick(): void {
    console.log("musicPlayBodyClick", cdAndLyricFlag);
    set_cdAndLyricFlag(!cdAndLyricFlag);
  }

  function onChange(e: any) {
    console.log("CD onChange", e.detail);
    pauseMusic();
    set_currentIndex(e.detail.current);
  }

  // 滑块事件 滑块结束
  function sliderOnChange(value) {
    // set_isSliding(false);
    isSliding_ref.current = false;
    console.log("sliderOnChange", {
      isSliding: isSliding_ref.current,
      value,
      durationTime,
    });
    const seekTime = durationTime * (value / 100);
    // 指定位置
    innerAudioContext.current.seek(seekTime);
    playMusic();
  }

  // 滑块滑动
  function sliderOnChanging(value) {
    // set_isSliding(true);
    isSliding_ref.current = true;
    const currentTime = durationTime * (value / 100);
    console.log("sliderOnChanging", {
      isSliding: isSliding_ref.current,
      value,
      currentTime,
    });
    set_currentTime(currentTime);
    set_sliderValue(value);
  }

  if (songTracks.length === 0) {
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
}
