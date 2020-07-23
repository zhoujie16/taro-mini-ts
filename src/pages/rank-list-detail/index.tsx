import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";
import HeaderPanel from "@/pages/rank-list-detail/comp/HeaderPanel";
import MusicList from "@/pages/rank-list-detail/comp/MusicList";
import { Ajax_playlist_detail } from "@/api/index.ts";

interface IState {
  playlist: any; // 歌单简介
  tracks: any[]; // 歌单列表
}

export default class Index extends Component<IState> {
  // 路由传来的参数
  routerParams: any = {};

  state = {
    playlist: {},
    tracks: [],
  };

  componentWillMount() {
    console.log("rank-list-detail componentWillMount");
  }

  componentDidMount() {
    console.log("rank-list-detail componentDidMount");
    this.routerParams = Taro.getCurrentInstance().router.params;
    console.log("routerParams", this.routerParams);
    this.initPage();
  }

  componentWillUnmount() {
    console.log("rank-list-detail componentWillUnmount");
  }

  componentDidShow() {
    console.log("rank-list-detail componentDidShow");
  }

  componentDidHide() {
    console.log("rank-list-detail componentDidHide");
  }

  initPage = async (): Promise<void> => {
    const [err, res] = await Ajax_playlist_detail({
      id: this.routerParams.id,
    });
    if (err) return;
    const { playlist } = res;
    this.setState({
      playlist,
      tracks: playlist.tracks,
    });
  };
  render() {
    return (
      <View className="page-wrap">
        <HeaderPanel playlist={this.state.playlist}></HeaderPanel>
        <MusicList tracks={this.state.tracks}></MusicList>
      </View>
    );
  }
}
