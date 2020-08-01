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
  routerParams: any = {}; // 路由传参
  innerAudioContext: any; // 音乐播放上下文

  songLyricLines: any[] = []; // 歌词格式化的数组

  timer_play: any; // 防抖定时器
  isSliding: boolean = false; // 是否在拖动进度条

  state: any = {
    playStatus: "stop", // 播放状态 播放 play  暂停 stop  等待 wait
    currentTime: 0, // 当前进度 （进度条用）
    durationTime: 0, // 总进度 (进度条用)
    sliderValue: 0, // 进度条值 (进度条用)
    lines: [], // 歌词面板用的歌词 (歌词面板)
    top: 0, // 歌词面板滚动距离 (歌词面板)
    cdAndLyricFlag: true,
    /**  */
    songTracks: [], // 播放列表
    currentIndex: 0, //当前播放序号
    currentSong: {}, // 当前播放歌曲
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
    // 获取播放列表
    const [err_songTracks, res_songTracks] = await Ajax_playlist_detail({
      id: this.routerParams.id,
    });
    if (err_songTracks) return;
    // res_songTracks.playlist.trackIds
    const songTracks = res_songTracks.playlist.tracks;
    console.log("songTracks", songTracks);
    // 设置播放列表

    this.setState(
      {
        songTracks,
      },
      () => {
        const num = Number(this.routerParams.num);
        this.setCurrentSong(num, true);
      }
    );
  };

  // 切歌 设置当前播放的歌曲
  setCurrentSong = async (
    currentIndex: number, // 序号
    isAutoPlay?: boolean // 是否立即播放
  ): Promise<any> => {
    const songTracks = this.state.songTracks;
    const currentSong = songTracks[currentIndex];
    this.setState({
      currentIndex: currentIndex,
      currentSong: currentSong,
    });

    // 获取 歌曲 歌词
    const [err_lyric, res_lyric] = await Ajax_lyric({
      id: currentSong.id,
    });
    if (err_lyric) return;
    console.log("res_lyric", res_lyric);
    const songLyric = res_lyric.lrc.lyric;

    // 解析歌词
    const lyricContext = new LyricContext(songLyric, () => {});
    this.songLyricLines = lyricContext.lines;

    this.setLyricAndSliderState(0);

    // 获取 歌曲 播放 链接
    const [err_song_url, res_song_url] = await Ajax_song_url({
      id: currentSong.id,
    });
    if (err_song_url) return;
    console.log("res_song_url", res_song_url);
    const songUrl = res_song_url.data[0].url;

    // 设置播放url
    this.innerAudioContext.src = songUrl;

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
    this.setCurrentSong(this.state.currentIndex - 1, true);
  };
  // 下一首
  nextBtnClick = (): void => {
    console.log("下一首");
    if (this.state.currentIndex === this.state.songTracks.length - 1) return;
    // 当前播放的停止
    this.pauseMusic();
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
    this.setState({
      playStatus: "stop",
    });
  };

  createInnerAudioContext = (): void => {
    this.innerAudioContext = Taro.createInnerAudioContext();

    // 音频进入可以播放状态
    this.innerAudioContext.onCanplay(() => {
      console.log("onCanplay");
      // 总时间
      const { duration } = this.innerAudioContext;
      this.setState({
        durationTime: duration,
      });
    });

    // 音频播放事件
    this.innerAudioContext.onPlay(() => {
      console.log("onPlay", this.innerAudioContext);
      this.setState({
        playStatus: "play",
      });
    });

    // 音频暂停事件
    this.innerAudioContext.onPause(() => {
      console.log("onPause");
      this.setState({
        playStatus: "stop",
      });
    });

    // 音频停止事件
    this.innerAudioContext.onStop(() => {
      console.log("onStop");
      this.setState({
        playStatus: "stop",
      });
    });

    // 音频自然播放结束事件
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

    // 音频播放进度更新事件 包括手动更新
    this.innerAudioContext.onTimeUpdate(() => {
      const { currentTime } = this.innerAudioContext;
      // console.log("onTimeUpdate", currentTime);
      if (currentTime === 0) {
        return;
      }
      this.setLyricAndSliderState(currentTime);
      this.setState({
        playStatus: "play",
      });
    });

    // 音频加载中事件，当音频因为数据不足
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

    // 音频播放错误事件
    this.innerAudioContext.onError((res) => {
      console.error("onError", res);
      this.setState({
        playStatus: "stop",
      });
    });
  };
  // 设置 歌词面板数据状态 和 滑块状态
  setLyricAndSliderState = (currentTime: number): void => {
    let top = 0;
    const lines = this.songLyricLines.map((x, index) => ({
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
    if (!this.isSliding) {
      const sliderValue = (currentTime / this.state.durationTime) * 100;
      this.setState({
        lines,
        top,
        currentTime,
        sliderValue,
      });
    }
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

  // 滑块事件
  sliderOnChange = (value) => {
    this.isSliding = false;
    console.warn("sliderOnChange", value);
    const seekTime = this.state.durationTime * (value / 100);
    // 指定位置
    this.innerAudioContext.seek(seekTime);
    this.playMusic();
  };

  sliderOnChanging = (value) => {
    this.isSliding = true;
    console.warn("sliderOnChanging", value);
    const currentTime = this.state.durationTime * (value / 100);
    this.setState({
      sliderValue: value,
      currentTime,
    });
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
            currentTime={this.state.currentTime}
            durationTime={this.state.durationTime}
            sliderValue={this.state.sliderValue}
            playStatus={this.state.playStatus}
            playBtnClicnFn={this.playBtnClick}
            preBtnClickFn={this.preBtnClick}
            nextBtnClickFn={this.nextBtnClick}
            sliderOnChange={this.sliderOnChange}
            sliderOnChanging={this.sliderOnChanging}
          ></MusicPlayBottom>
        </View>
        {/* <View className="music-play__bottom-span"></View> */}
      </View>
    );
  }
}
