import Http from "@/common/http/index.ts";

export const AjaxTestData = params =>
  Http.get("/qy/chat/wx/bannerList", params, {
    isLoading: true
  });
