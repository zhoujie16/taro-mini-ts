import { useState, useEffect } from "react";
import { useRouter } from "@tarojs/taro";
import "./index.scss";
import LyricContext from "./comp/MusicPlayLyric/lyric-parser";
import {
  Ajax_lyric,
  Ajax_song_url,
  Ajax_playlist_detail,
} from "@/api/index.ts";

// 获取歌曲播放列表的 Hook
export function useGetSongTracks(): any {
  const routerParams: any = useRouter().params;
  const [songTracks, set_songTracks] = useState([]);
  useEffect(() => {
    (async function () {
      const [err_songTracks, res_songTracks] = await Ajax_playlist_detail({
        id: routerParams.id,
      });
      if (err_songTracks) return;
      const _songTracks = res_songTracks.playlist.tracks;
      console.log("songTracks", _songTracks);
      // 设置播放列表
      set_songTracks(_songTracks);
    })();
  }, []);

  return songTracks;
}

// 获取 当前播放歌曲的Hook
export function useGetCurrentSong(
  songTracks: any[],
  currentIndex: number
): any {
  const [currentSong, set_currentSong] = useState({});
  useEffect(() => {
    if (songTracks.length) {
      set_currentSong(songTracks[currentIndex]);
    }
  }, [songTracks, currentIndex]);
  return currentSong;
}

// 获取歌词 解析歌词 的 Hook
export function useGetLyric(currentSong: any): any {
  const [songLyricLines, set_songLyricLines] = useState([]);
  useEffect(() => {
    (async () => {
      if (currentSong.id) {
        // 获取 歌曲 歌词
        const [err_lyric, res_lyric] = await Ajax_lyric({
          id: currentSong.id,
        });
        if (err_lyric) return;
        console.log("res_lyric", res_lyric);
        const songLyric = res_lyric.lrc.lyric;
        // // 解析歌词
        const lyricContext: any = new LyricContext(songLyric, () => {});
        set_songLyricLines(lyricContext.lines);
      }
    })();
  }, [currentSong]);
  return songLyricLines;
}

// 获取歌曲播放信息的Hook
export function useGetSongUrl(currentSong: any) {
  const [songUrl, set_songUrl] = useState("");
  useEffect(() => {
    (async () => {
      const id = currentSong.id;
      if (id) {
        // 获取 歌曲 播放 链接
        const [err_song_url, res_song_url] = await Ajax_song_url({
          id: currentSong.id,
        });
        if (err_song_url) return;
        console.log("res_song_url", res_song_url);
        const _songUrl = res_song_url.data[0].url;
        set_songUrl(_songUrl);
      }
    })();
  }, [currentSong]);
  return songUrl;
}

// 获取 歌词状态和滑块的Hook
export function useGetLyricAndSliderState(
  songLyricLines: any[],
  currentTime: number
): any {
  const [lines, set_lines] = useState([]); // 歌词面板用的歌词 (歌词面板)
  const [top, set_top] = useState(0); // 歌词面板滚动距离 (歌词面板)
  useEffect(() => {
    (async () => {
      let top = 0;
      const lines: any = songLyricLines.map((x, index) => ({
        ...x,
        index,
        active: false,
      }));
      lines.forEach((x) => (x.active = false));
      const lineItemIndex = lines.findIndex((item) => {
        return item.time >= currentTime * 1000;
      });
      if (lineItemIndex > 0) {
        const lineItem = lines[lineItemIndex - 1];
        lineItem.active = true;
        top = lineItem.index * 40;
        // console.log(lineItem);
      }
      set_lines(lines);
      set_top(top);
    })();
  }, [currentTime]);
  return {
    lines,
    top,
  };
}
