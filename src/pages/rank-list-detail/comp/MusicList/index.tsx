import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";
import MusicListNav from "@/pages/rank-list-detail/comp/MusicListNav";
import MusicListCell from "@/pages/rank-list-detail/comp/MusicListCell";

interface IProps {
  tracks: any[];
  cellClickFn: any;
}

export default class Index extends Component<IProps> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log("MusicList componentWillMount");
  }

  componentDidMount() {
    console.log("MusicList componentDidMount");
  }

  componentWillUnmount() {
    console.log("MusicList componentWillUnmount");
  }

  render() {
    return (
      <View className="music-list">
        <MusicListNav curLength={this.props.tracks.length}></MusicListNav>
        <View className="music-list__list">
          {this.props.tracks.map((item, index) => (
            <MusicListCell
              key={index}
              musicInfo={item}
              curIndex={index + 1}
              cellClickFn={this.props.cellClickFn}
            ></MusicListCell>
          ))}
        </View>
      </View>
    );
  }
}
