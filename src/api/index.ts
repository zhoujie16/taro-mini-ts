import Http from "@/common/http/index.ts";

export const AjaxTestData = (params?: any): Promise<any[]> =>
  Http.get("/qy/chat/wx/bannerList", params, {
    isLoading: true,
  });

export const Ajax_toplist = (params?: any): Promise<any[]> =>
  Http.get("/toplist", params, {
    isLoading: false,
  });

// 所有榜单内容摘要 /toplist/detail
export const Ajax_toplist_detail = (params?: any): Promise<any[]> =>
  Http.get("/toplist/detail", params, {
    isLoading: false,
  });

// 获取歌单详情
export const Ajax_playlist_detail = (params?: any): Promise<any[]> =>
  Http.get("/playlist/detail", params, {
    isLoading: false,
  });

// 获取歌曲详情
export const Ajax_song_detail = (params?: any): Promise<any[]> =>
  Http.get("/song/detail", params, {
    isLoading: false,
  });

// 获取歌词
export const Ajax_lyric = (params?: any): Promise<any[]> =>
  Http.get("/lyric", params, {
    isLoading: false,
  });

// 音乐是否可用
export const Ajax_check_music = (params?: any): Promise<any[]> =>
  Http.get("/check/music", params, {
    isLoading: false,
  });

// 获取音乐 url
export const Ajax_song_url = (params?: any): Promise<any[]> =>
  Http.get("/song/url", params, {
    isLoading: false,
  });
