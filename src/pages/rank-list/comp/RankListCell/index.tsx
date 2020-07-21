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

  public get coverImgUrl(): string {
    return this.props.detailInfo.coverImgUrl;
  }

  public get tracks(): any[] {
    return this.props.detailInfo.tracks;
  }

  public get id(): string {
    return this.props.detailInfo.id;
  }

  componentWillMount() {
    console.log("RankListCell componentWillMount");
  }

  componentDidMount() {
    console.log("RankListCell componentDidMount");
    console.info(this.coverImgUrl);
  }

  componentWillUnmount() {
    console.log("RankListCell componentWillUnmount");
  }

  render() {
    return (
      <View
        onClick={() => this.props.onClick(this.id)}
        className="rank-list-cell"
      >
        <View className="rank-list-cell__inner">
          <View className="rank-list-cell__cover">
            <Image
              className="rank-list-cell__cover-img"
              src={this.coverImgUrl}
            />
          </View>
          <View className="rank-list-cell__info">
            {this.tracks.map((item, index) => (
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
