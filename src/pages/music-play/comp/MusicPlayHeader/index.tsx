import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  currentSong: any;
}

export default class Index extends Component<IProps, IState> {
  state = {};
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

  bacnBtnClick = (): void => {
    Taro.navigateBack();
  };

  render() {
    let name = "";
    let ar = "";
    try {
      name = this.props.currentSong.name;
      ar = this.props.currentSong.ar.map((x) => x.name).join(",");
    } catch (error) {}

    if (ar === "" || name === "") return "";
    return (
      <View className="music-paly-header">
        <View
          className="music-paly-header__left"
          onClick={this.bacnBtnClick}
        ></View>
        <View className="music-paly-header__title">
          <Text className="music-paly-header__al-name">{name}</Text>
          <Text className="music-paly-header__ar-name">{ar}</Text>
        </View>
        <View className="music-paly-header__right"></View>
      </View>
    );
  }
}
