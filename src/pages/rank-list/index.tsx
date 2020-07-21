import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import Utils from "@/common/utils/index.ts";
import { AtNavBar } from "taro-ui";
import RankListCell from "./comp/RankListCell";
import { Ajax_toplist_detail } from "@/api/index.ts";

interface IState {
  rankList: any[];
}

export default class Index extends Component<IState> {
  state = {
    rankList: [],
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
    });
  };

  rankListCellClick = async (id: string): Promise<void> => {
    console.log("RankListCell", id);
    await Taro.navigateTo({
      url: `/pages/rank-list-detail/index?id=${id}`,
    });
  };
  render() {
    return (
      <View className="page-wrap">
        <AtNavBar color="#000" title="排行榜" />
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
      </View>
    );
  }
}
