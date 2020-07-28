import React, { Component } from "react";
import { View, ScrollView } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IProps {
  lines: any[];
  top: number;
}

interface IState {}

export default class Index extends Component<IProps, IState> {
  state = {
    scrollTop: 0,
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(" componentWillMount");
  }

  componentDidMount() {
    console.log(" componentDidMount");
  }

  componentWillUnmount() {
    console.log(" componentWillUnmount");
  }
  onScroll(e) {
    // console.log(e.detail);
  }

  render() {
    return (
      <View className="music-play-lyric">
        <View className="music-play-lyric__inner">
          <ScrollView
            className="music-play-lyric__inner-lyric-scroll"
            scrollY
            scrollWithAnimation
            scrollTop={this.props.top}
            onScroll={this.onScroll}
          >
            <View className="music-play-lyric__inner-lyric">
              {this.props.lines.map((item, index) => {
                return (
                  <View
                    className={
                      item.active
                        ? "music-play-lyric__line music-play-lyric__line--active"
                        : "music-play-lyric__line"
                    }
                    key={index}
                  >
                    {item.txt}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
