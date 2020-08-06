import { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import "./index.scss";
import { Ajax_playlist_detail } from "@/api/index.ts";

// 获取播放列表的hook
export function useGetPlaylist(): any {
  const routerParams = useRouter().params;
  const [playlist, setPlaylist] = useState({});

  useEffect(() => {
    async function ajaxData(): Promise<void> {
      const [err, res] = await Ajax_playlist_detail({
        id: routerParams.id,
      });
      if (err) return;
      const { playlist } = res;
      setPlaylist(playlist);
    }

    ajaxData();
  }, []);
  return playlist;
}
