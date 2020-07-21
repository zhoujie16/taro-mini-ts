import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";

interface IState {}

interface IProps {}

export default class Index extends Component<IState, IProps> {
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

  render() {
    return (
      <View className="index">
        <Text>Hello world!</Text>
      </View>
    );
  }
}
