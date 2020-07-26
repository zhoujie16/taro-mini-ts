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
    const { coverImgUrl, tracks, id, updateFrequency } = this.props.detailInfo;
    return (
      <View onClick={() => this.props.onClick(id)} className="rank-list-cell">
        <View className="rank-list-cell__inner">
          <View className="rank-list-cell__cover">
            <Image className="rank-list-cell__cover-img" src={coverImgUrl} />
            <View className="rank-list-cell__update-time">
              {updateFrequency}
            </View>
          </View>
          <View className="rank-list-cell__info">
            {tracks.map((item, index) => (
              <Text key={index} className="rank-list-cell__text">{`${
                index + 1
              }.${item.first} - ${item.second}`}</Text>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
