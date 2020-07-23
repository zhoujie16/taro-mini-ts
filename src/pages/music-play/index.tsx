import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { Ajax_song_detail, Ajax_lyric, Ajax_song_url } from "@/api";
import MusicPlayBottom from "./comp/MusicPlayBottom";
import MusicPlayCD from "./comp/MusicPlayCD";
import MusicPlayLyric from "./comp/MusicPlayLyric";
import MusicPlayHeader from "./comp/MusicPlayHeader";
import LyricContext from "./comp/MusicPlayLyric/lyric-parser";

interface IState {
  isPlay: boolean; // 是否正在播放中
  songDetail: any; // 歌曲详情
  songLyric: string; // 歌词
  songUrl: string; // 歌曲链接
}

export default class Index extends Component<IState> {
  routerParams: any = {};
  innerAudioContext: any; // 音乐播放上下文
  lyricContext: any;
  musicUrl: string;
  state: any = {
    isPlay: false,
    songDetail: {},
    songLyric: "",
    songLyricLines: [], // 歌词格式化的数组
    songUrl: "",
    currentTime: 0,
    lines: [],
    top: 0,
    cdAndLyricFlag: true,
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
    this.initPage();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  componentDidShow() {
    console.log("componentDidShow");
  }

  componentDidHide() {
    console.log("componentDidHide");
  }

  initPage = async (): Promise<void> => {
    const [err_song_detail, res_song_detail] = await Ajax_song_detail({
      ids: this.routerParams.id,
    });
    if (err_song_detail) return;
    console.log("res_song_detail", res_song_detail);

    const songDetail = res_song_detail.songs[0];

    const [err_lyric, res_lyric] = await Ajax_lyric({
      id: this.routerParams.id,
    });
    if (err_lyric) return;
    console.log("res_lyric", res_lyric);

    const songLyric = res_lyric.lrc.lyric;

    const [err_song_url, res_song_url] = await Ajax_song_url({
      id: this.routerParams.id,
    });
    if (err_song_url) return;
    console.log("res_song_url", res_song_url);
    const songUrl = res_song_url.data[0].url;

    this.lyricContext = new LyricContext(songLyric, () => {});
    console.log("this.lyricContext", this.lyricContext);
    this.setState(
      {
        songDetail,
        songLyric,
        songUrl,
        songLyricLines: this.lyricContext.lines,
      },
      () => {
        console.log("music play state", this.state);
        this.createInnerAudioContext();
        const { top, lines } = this.cumputeTopAndLine();
        this.setState({
          lines,
          top,
        });
      }
    );
  };

  // 播放按钮点击事件
  playBtnClick = (): void => {
    const isPlay = this.state.isPlay;
    if (isPlay) {
      console.log("暂停");
      this.pauseMusic();
    } else {
      console.log("播放");
      this.playMusic();
    }
    this.setState({
      isPlay: !isPlay,
    });
  };

  playMusic = (): void => {
    this.innerAudioContext.play();
  };

  pauseMusic = (): void => {
    this.innerAudioContext.pause();
  };

  createInnerAudioContext = (): void => {
    this.innerAudioContext = Taro.createInnerAudioContext();
    this.innerAudioContext.src = this.state.songUrl;
    this.innerAudioContext.onCanplay(() => {
      console.log("onCanplay");
    });
    this.innerAudioContext.onPlay(() => {
      console.log("onPlay");
      this.setCurrentTime();
    });
    this.innerAudioContext.onPause(() => {
      console.log("onPause");
      this.setCurrentTime();
    });
    this.innerAudioContext.onStop(() => {
      console.log("onStop");
    });
    this.innerAudioContext.onEnded(() => {
      console.log("onEnded");
    });
    this.innerAudioContext.onTimeUpdate(() => {
      console.log("onTimeUpdate");
      this.setCurrentTime();
    });
    this.innerAudioContext.onWaiting(() => {
      console.log("onWaiting");
    });
    this.innerAudioContext.onSeeking(() => {
      console.log("onSeeking");
    });
    this.innerAudioContext.onSeeked(() => {
      console.log("onSeeked");
    });
    this.innerAudioContext.onError((res) => {
      console.log("onError", res);
    });
  };

  setCurrentTime = () => {
    const { currentTime } = this.innerAudioContext;
    console.log("currentTime", currentTime);
    this.setState(
      {
        currentTime: currentTime * 1000,
      },
      () => {
        const { top, lines } = this.cumputeTopAndLine();
        this.setState({
          lines,
          top,
        });
      }
    );
  };

  cumputeTopAndLine = (): any => {
    const { songLyricLines, currentTime } = this.state;
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
      const lineItem = lines[lineItemIndex-1];
      lineItem.active = true;
      top = lineItem.index * 40;
      console.log(lineItem);
    }

    return { top, lines };
  };

  musicPlayBodyClick = (): void => {
    console.log("musicPlayBodyClick");
    this.setState({
      cdAndLyricFlag: !this.state.cdAndLyricFlag,
    });
  };

  render() {
    return (
      <View className="music-play-page-wrap">
        <View className="music-play__header">
          <MusicPlayHeader songDetail={this.state.songDetail}></MusicPlayHeader>
        </View>
        <View
          className="music-play__content"
          onClick={() => this.musicPlayBodyClick()}
        >
          <View
            className={
              this.state.cdAndLyricFlag
                ? "music-play__content__inner music-play__content__inner--cd"
                : "music-play__content__inner"
            }
          >
            <MusicPlayCD
              songDetail={this.state.songDetail}
              isPlay={this.state.isPlay}
            ></MusicPlayCD>
          </View>
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
            isPlay={this.state.isPlay}
            playBtnClicnFn={this.playBtnClick}
          ></MusicPlayBottom>
        </View>
      </View>
    );
  }
}
