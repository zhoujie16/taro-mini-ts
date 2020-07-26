import React, { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

interface IProps {
  detailInfo: any;
  onClick: any;
}

export default class Index extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("RankListCell componentWillMount");
  }

  componentDidMount() {
    console.log("RankListCell componentDidMount");
  }

  componentWillUnmount() {
    console.log("RankListCell componentWillUnmount");
  }

  render() {
    const { detailInfo } = this.props;
    const { id, coverImgUrl, name, updateFrequency } = detailInfo;
    return (
      <View onClick={() => this.props.onClick(id)} className="rank-list-card">
        <View className="rank-list-card__inner">
          <View className="rank-list-card__cover">
            <Image className="rank-list-card__cover-img" src={coverImgUrl} />
            <View className="rank-list-card__update-time">{updateFrequency}</View>
          </View>
          <View className="rank-list-card__text">{name}</View>
        </View>
      </View>
    );
  }
}
