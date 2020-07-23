import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {
  songDetail: any;
}

export default class Index extends Component<IProps, IState> {
  state = {};
  constructor(props) {
    super(props);
  }

  public get name(): string {
    let name = "";
    try {
      name = this.props.songDetail.name;
    } catch (error) {
      console.log(error);
    }
    return name;
  }

  public get ar(): string {
    let ar = "";
    try {
      ar = this.props.songDetail.ar.map((x) => x.name).join(",");
    } catch (error) {
      console.log(error);
    }
    return ar;
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
    return (
      <View className="music-paly-header">
        <View
          className="music-paly-header__left"
          onClick={this.bacnBtnClick}
        ></View>
        <View className="music-paly-header__title">
          <Text className="music-paly-header__al-name">{this.name}</Text>
          <Text className="music-paly-header__ar-name">{this.ar}</Text>
        </View>
        <View className="music-paly-header__right"></View>
      </View>
    );
  }
}
