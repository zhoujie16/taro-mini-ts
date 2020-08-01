import React from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

interface IProps {
  playlist: any;
}

const HeaderPanel = (props: IProps) => {
  const { coverImgUrl, name, description, creator } = props.playlist;

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
          <Image className="header-panel__cover-img" src={coverImgUrl}></Image>
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
};

export default HeaderPanel;
