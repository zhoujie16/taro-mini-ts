import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { AtActivityIndicator } from "taro-ui";
import RankListCell from "./comp/RankListCell";
import RankListCard from "./comp/RankListCard";
import { Ajax_toplist_detail } from "@/api/index.ts";

function RankList() {
  const [rankList, setRankList] = useState([]);
  const [rankList_other, setRankList_other] = useState([]);

  useEffect(() => {
    console.log("useEffect");
    initPage();
  }, [0]);

  // 初始化
  async function initPage(): Promise<void> {
    const [err, res] = await Ajax_toplist_detail();
    if (err) return;
    setRankList(res.list.slice(0, 4));
    setRankList_other(res.list.slice(4, res.list.length));
  }

  // 点击事件
  async function rankListCellClick(id: string): Promise<void> {
    console.log("RankListCell", id);
    await Taro.navigateTo({
      url: `/pages/rank-list-detail/index?id=${id}`,
    });
  }

  if (rankList.length === 0) {
    return (
      <View className="rank-list-page-wrap">
        <AtActivityIndicator
          mode="center"
          content="加载中..."
          size={32}
        ></AtActivityIndicator>
      </View>
    );
  }
  return (
    <View className="rank-list-page-wrap">
      {/* 官方榜单 */}
      <View className="rank-list-title">官方榜</View>
      <View className="rank-list-wrap">
        {rankList.map((item, index) => {
          return (
            <RankListCell
              key={index}
              detailInfo={item}
              onClick={async (id: string): Promise<any> =>
                rankListCellClick(id)
              }
            ></RankListCell>
          );
        })}
      </View>
      {/* 其他榜单 */}
      <View className="rank-list-title">其他榜单</View>
      <View className="rank-list-other-wrap">
        {rankList_other.map((item, index) => {
          return (
            <RankListCard
              key={index}
              detailInfo={item}
              onClick={async (id: string): Promise<any> =>
                rankListCellClick(id)
              }
            ></RankListCard>
          );
        })}
      </View>
    </View>
  );
}

export default RankList;
