import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AjaxTestData } from "@/api/index.ts";
import { AtButton } from "taro-ui";

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {
    console.log("componentDidMount");
    this.testAjax();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  testAjax = async (): Promise<void> => {
    const [err, res] = await AjaxTestData({ groupKey: "Her Way" });
    console.log("test Ajax", [err, res]);
  };

  render() {
    return (
      <View className="index">
        <Text>Hello world!</Text>
        <AtButton type="primary">按钮文案</AtButton>
      </View>
    );
  }
}
