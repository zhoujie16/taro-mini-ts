import React, { Component } from "react";
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

interface IState {}

export default class Index extends Component<IState> {
  routerParams: any = {};
  innerAudioContext: any; // 音乐播放上下文
  songLyricLines: any[] = []; // 歌词格式化的数组
  timer_play: any; // 防抖定时器
  state: any = {
    playStatus: "stop", // 播放状态 播放 play  暂停 stop  等待 wait
    currentTime: 0,
    lines: [], // 歌词面板用的歌词
    top: 0, // 歌词面板滚动距离
    cdAndLyricFlag: true,
    /**  */
    songTracks: [], // 播放列表
    currentIndex: 0, //当前播放序号
    currentSong: {}, // 当前播放
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.routerParams = Taro.getCurrentInstance().router.params;
    console.log("routerParams", this.routerParams);
    this.createInnerAudioContext();
    this.initPage();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    // 销毁音乐播放组件
    this.innerAudioContext.destroy();
  }

  componentDidShow() {
    console.log("componentDidShow");
  }

  componentDidHide() {
    console.log("componentDidHide");
  }

  initPage = async (): Promise<void> => {
    const [err_songTracks, res_songTracks] = await Ajax_playlist_detail({
      id: this.routerParams.id,
    });
    if (err_songTracks) return;
    // res_songTracks.playlist.trackIds
    const songTracks = res_songTracks.playlist.tracks;
    console.log("songTracks", songTracks);
    this.setState(
      {
        songTracks,
      },
      () => {
        this.setCurrentSong(Number(this.routerParams.num), true);
      }
    );
  };

  // 设置当前播放的歌曲
  setCurrentSong = async (
    currentIndex: number,
    isAutoPlay?: boolean
  ): Promise<any> => {
    const songTracks = this.state.songTracks;
    const currentSong = songTracks[currentIndex];
    this.setState({
      currentIndex: currentIndex,
      currentSong: currentSong,
    });
    // 下载setCurrentSong
    const [err_lyric, res_lyric] = await Ajax_lyric({
      id: currentSong.id,
    });
    if (err_lyric) return;
    console.log("res_lyric", res_lyric);
    const songLyric = res_lyric.lrc.lyric;

    const [err_song_url, res_song_url] = await Ajax_song_url({
      id: currentSong.id,
    });
    if (err_song_url) return;
    console.log("res_song_url", res_song_url);
    const songUrl = res_song_url.data[0].url;
    this.innerAudioContext.src = songUrl;

    const lyricContext = new LyricContext(songLyric, () => {});
    this.songLyricLines = lyricContext.lines;
    this.cumputeTopAndLine(this.songLyricLines, 0);
    if (isAutoPlay) {
      this.playMusic();
    }
  };

  // 播放按钮点击事件
  playBtnClick = (): void => {
    const { playStatus } = this.state;
    if (playStatus === "play") {
      this.pauseMusic();
    } else if (playStatus === "stop") {
      this.playMusic();
    }
  };
  // 上一首
  preBtnClick = (): void => {
    console.log("上一首");
    if (this.state.currentIndex === 0) return;
    // 当前播放的停止
    this.pauseMusic();
    this.setState({
      playStatus: "stop",
    });
    this.setCurrentSong(this.state.currentIndex - 1, true);
  };
  // 下一首
  nextBtnClick = (): void => {
    console.log("下一首");
    if (this.state.currentIndex === this.state.songTracks.length - 1) return;
    // 当前播放的停止
    this.pauseMusic();
    this.setState({
      playStatus: "stop",
    });
    this.setCurrentSong(this.state.currentIndex + 1, true);
  };

  playMusic = (): void => {
    // 防抖
    if (this.timer_play) {
      clearTimeout(this.timer_play);
      this.timer_play = null;
    }
    this.timer_play = setTimeout(() => {
      this.innerAudioContext.play();
    }, 400);
  };

  pauseMusic = (): void => {
    this.innerAudioContext.pause();
  };

  createInnerAudioContext = (): void => {
    this.innerAudioContext = Taro.createInnerAudioContext();
    this.innerAudioContext.onCanplay(() => {
      console.log("onCanplay");
    });
    this.innerAudioContext.onPlay(() => {
      console.log("onPlay");
      this.setState({
        playStatus: "play",
      });
    });
    this.innerAudioContext.onPause(() => {
      console.log("onPause");
      this.setState({
        playStatus: "stop",
      });
    });
    this.innerAudioContext.onStop(() => {
      console.log("onStop");
      this.setState({
        playStatus: "stop",
      });
    });
    this.innerAudioContext.onEnded(() => {
      console.log("onEnded");
      this.setState(
        {
          playStatus: "stop",
        },
        () => {
          this.nextBtnClick();
        }
      );
    });
    this.innerAudioContext.onTimeUpdate(() => {
      console.log("onTimeUpdate");
      const { currentTime } = this.innerAudioContext;
      if (currentTime === 0) {
        return;
      }
      this.setCurrentTime();
      this.setState({
        playStatus: "play",
      });
    });
    this.innerAudioContext.onWaiting(() => {
      console.log("onWaiting");
      this.setState({
        playStatus: "wait",
      });
    });
    this.innerAudioContext.onSeeking(() => {
      console.log("onSeeking");
      this.setState({
        playStatus: "wait",
      });
    });
    this.innerAudioContext.onSeeked(() => {
      console.log("onSeeked");
    });
    this.innerAudioContext.onError((res) => {
      console.log("onError", res);
      this.setState({
        playStatus: "stop",
      });
    });
  };

  setCurrentTime = () => {
    const { currentTime } = this.innerAudioContext;
    console.log("currentTime", currentTime * 1000);
    this.cumputeTopAndLine(this.songLyricLines, currentTime * 1000);
  };

  // 计算歌词面板的状态数据
  cumputeTopAndLine = (songLyricLines: any[], currentTime: number): any => {
    let top = 0;
    const lines = songLyricLines.map((x, index) => ({
      ...x,
      index,
      active: false,
    }));
    lines.forEach((x) => (x.active = false));
    const lineItemIndex = lines.findIndex((item) => {
      return item.time >= currentTime;
    });
    if (lineItemIndex > 0) {
      const lineItem = lines[lineItemIndex - 1];
      lineItem.active = true;
      top = lineItem.index * 40;
      console.log(lineItem);
    }
    this.setState({
      lines,
      top,
    });
  };

  musicPlayBodyClick = (): void => {
    console.log("musicPlayBodyClick");
    this.setState({
      cdAndLyricFlag: !this.state.cdAndLyricFlag,
    });
  };

  onChange = (e) => {
    console.log("onChange", e.detail);
    this.setCurrentSong(e.detail.current, true);
  };
  render() {
    if (!this.state.currentSong.id) {
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
          <MusicPlayHeader
            currentSong={this.state.currentSong}
          ></MusicPlayHeader>
        </View>
        <View
          className="music-play__content"
          onClick={() => this.musicPlayBodyClick()}
        >
          {/* 音乐CD */}
          <View
            className={
              this.state.cdAndLyricFlag
                ? "music-play__content__inner music-play__content__inner--cd"
                : "music-play__content__inner"
            }
          >
            <MusicPlayCD
              songTracks={this.state.songTracks}
              currentIndex={this.state.currentIndex}
              playStatus={this.state.playStatus}
              onChange={this.onChange}
            ></MusicPlayCD>
          </View>
          {/* 歌词 */}
          <View
            className={
              this.state.cdAndLyricFlag
                ? "music-play__content__inner"
                : "music-play__content__inner music-play__content__inner--lyr"
            }
          >
            <MusicPlayLyric
              top={this.state.top}
              lines={this.state.lines}
            ></MusicPlayLyric>
          </View>
        </View>
        <View className="music-play__bottom">
          <MusicPlayBottom
            playStatus={this.state.playStatus}
            playBtnClicnFn={this.playBtnClick}
            preBtnClickFn={this.preBtnClick}
            nextBtnClickFn={this.nextBtnClick}
          ></MusicPlayBottom>
        </View>
      </View>
    );
  }
}
