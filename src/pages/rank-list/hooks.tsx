import { useState, useEffect } from "react";
import "./index.scss";
import { Ajax_toplist_detail } from "@/api/index.ts";

export function useGetRankList() {
  const [rankList, setRankList] = useState([]);
  const [rankList_other, setRankList_other] = useState([]);
  useEffect(() => {
    // 请求数据
    async function getData(): Promise<void> {
      const [err, res] = await Ajax_toplist_detail();
      if (err) return;
      setRankList(res.list.slice(0, 4));
      setRankList_other(res.list.slice(4, res.list.length));
    }
    getData();
  }, []);
  return { rankList, rankList_other };
}
