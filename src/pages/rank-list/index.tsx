import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";
import { AtActivityIndicator } from "taro-ui";
import RankListCell from "./comp/RankListCell";
import RankListCard from "./comp/RankListCard";
import { Ajax_toplist_detail } from "@/api/index.ts";

interface IState {
  rankList: any[];
  rankList_other: any[];
}

export default class Index extends Component<IState> {
  state = {
    rankList: [],
    rankList_other: [],
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log("rank-list componentWillMount");
  }

  componentDidMount() {
    console.log("rank-list componentDidMount");
    this.initPage();
  }

  componentWillUnmount() {
    console.log("rank-list componentWillUnmount");
  }

  componentDidShow() {
    console.log("rank-list componentDidShow");
  }

  componentDidHide() {
    console.log("rank-list componentDidHide");
  }

  initPage = async (): Promise<void> => {
    const [err, res] = await Ajax_toplist_detail();
    if (err) return;
    this.setState({
      rankList: res.list.slice(0, 4),
      rankList_other: res.list.slice(4, res.list.length),
    });
  };

  rankListCellClick = async (id: string): Promise<void> => {
    console.log("RankListCell", id);
    await Taro.navigateTo({
      url: `/pages/rank-list-detail/index?id=${id}`,
    });
  };
  render() {
    if (this.state.rankList.length === 0) {
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
          {this.state.rankList.map((item, index) => {
            return (
              <RankListCell
                key={index}
                detailInfo={item}
                onClick={async (id: string): Promise<any> =>
                  this.rankListCellClick(id)
                }
              ></RankListCell>
            );
          })}
        </View>
        {/* 其他榜单 */}
        <View className="rank-list-title">其他榜单</View>
        <View className="rank-list-other-wrap">
          {this.state.rankList_other.map((item, index) => {
            return (
              <RankListCard
                key={index}
                detailInfo={item}
                onClick={async (id: string): Promise<any> =>
                  this.rankListCellClick(id)
                }
              ></RankListCard>
            );
          })}
        </View>
      </View>
    );
  }
}
