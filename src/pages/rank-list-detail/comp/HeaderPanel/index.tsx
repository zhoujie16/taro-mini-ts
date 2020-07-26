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
    const { coverImgUrl, name, description, creator } = this.props.playlist;

    return (
      <View className="header-panel">
        <View className="header-panel-bg">
          <Image
            className="header-panel-bg-img"
            src={creator.backgroundUrl}
            mode="aspectFill"
          ></Image>
        </View>
        <View className="header-panel__inner">
          <View className="header-panel__cover">
            <Image
              className="header-panel__cover-img"
              src={coverImgUrl}
            ></Image>
          </View>
          <View className="header-panel__info">
            <View className="header-panel__info-title">{name}</View>
            <View className="header-panel__info-creator">
              <Image
                className="header-panel__info-creator-avatar"
                src={creator.avatarUrl}
              ></Image>
              <View className="header-panel__info-creator-nickname">
                {creator.nickname}
              </View>
            </View>
            <View className="header-panel__info-description">{description}</View>
          </View>
        </View>
      </View>
    );
  }
}
