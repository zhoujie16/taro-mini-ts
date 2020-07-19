import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AjaxTestData } from "@/api/index.ts";

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {
    console.log("componentDidMount");
    this.testAjax();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async testAjax() {
    const [err, res] = await AjaxTestData();
    console.log("test Ajax", [err, res]);
  }
  render() {
    return (
      <View className="index">
        <Text>Hello world!</Text>
      </View>
    );
  }
}
