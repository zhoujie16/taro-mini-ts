import React from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

interface IProps {
  detailInfo: any;
  onClick: any;
}

export default function (props: IProps) {
  const { detailInfo } = props;
  const { id, coverImgUrl, name, updateFrequency } = detailInfo;
  return (
    <View onClick={() => props.onClick(id)} className="rank-list-card">
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
