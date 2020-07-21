/**
 * @Author: zhoujie
 * @Date: 2020-07-18
 **/
import Taro from "@tarojs/taro";
import AppConfig from "@/config/index.ts";

// 定义规则接口
interface HttpRule {
  baseURL: string;
  sleep(timeLen: number): Promise<void>;
  ajax(ajaxParams: AjaxParams): Promise<any[]>;
  get(url: string, data: any, _config: any): Promise<any[]>;
  post(url: string, data: any, _config: any): Promise<any[]>;
}

// 定义请求参数接口
interface AjaxParams {
  url: string;
  method: any;
  data?: any;
  _config?: any;
}
class Http implements HttpRule {
  baseURL = AppConfig.requsetUrl;
  sleep = (timeLen: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(resolve, timeLen);
    });
  /**
   * 发送请求
   */
  async ajax(ajaxParams: AjaxParams): Promise<any[]> {
    const { url, method = "GET", data = {}, _config = {} } = ajaxParams;
    const config: any = {
      isLoading: false,
      showError: true,
      ..._config,
    };
    let requestUrl: string = this.baseURL + url;
    if (url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1) {
      requestUrl = url;
    }
    if (config.isLoading) {
      Taro.showLoading({
        title: "加载中",
      });
    }
    console.log("http 请求 url: ", url);
    console.log("http 请求 参数: ", data);
    let requestError: any = null;
    let requestRes: any = {};
    try {
      requestRes = await Taro.request({
        url: requestUrl,
        method,
        data,
        header: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    } catch (error) {
      console.log("请求出错", error);
      requestError = error;
    }
    console.log("http 请求 响应: ", requestRes.data);
    if (config.isLoading) {
      await this.sleep(300);
      Taro.hideLoading();
    }

    if (requestError) {
      // 请求发送时候失败
      Taro.showToast({
        title: "请求发送失败, 请检查您的网络",
        icon: "none",
        duration: 2000,
      });
      return ["error", null];
    }
    const resultCode: number = requestRes.data.code;
    if (resultCode !== 200) {
      const errMsg = requestRes.data.errorMsg || "请求出错";
      if (config.showError) {
        Taro.showToast({
          title: String(errMsg),
          icon: "none",
          duration: 2000,
        });
      }
      return [resultCode, errMsg];
    }
    return [null, requestRes.data];
  }

  async get(url: string, data: any, _config: any): Promise<any[]> {
    const method: string = "GET";
    return await this.ajax({
      url,
      method,
      data: { ...data, t: new Date().getTime() },
      _config,
    });
  }

  async post(url: string, data: any, _config: any): Promise<any[]> {
    const method: string = "POST";
    return await this.ajax({
      url,
      method,
      data: { ...data },
      _config,
    });
  }
}
export default new Http();
