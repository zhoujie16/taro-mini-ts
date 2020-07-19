import Http from "@/common/http/index.ts";

export const AjaxTestData = (params?: any): Promise<any[]> =>
  Http.get("/qy/chat/wx/bannerList", params, {
    isLoading: true,
  });
