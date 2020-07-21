import React, { Component } from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

interface IProps {
  playlist: any;
}

export default class Index extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="header-panel">
        <View className="header-panel__inner">
          <View className="header-panel__cover">
            <Image
              className="header-panel__cover-img"
              src={this.props.playlist.coverImgUrl}
            ></Image>
          </View>
          <View className="header-panel__info">
            <View className="header-panel__info-title">
              {this.props.playlist.name}
            </View>
            <View className="header-panel__info-sub-title">
              {this.props.playlist.description}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
