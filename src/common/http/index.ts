/**
 * @Author: zhoujie
 * @Date: 2020-06-30
 * @Last Modified: 2020-06-30 zhoujie
 **/
import Taro from "@tarojs/taro";
import AppConfig from "@/config/index.ts";

class Http {
  constructor(arg) {}
  async sleep(timeLen) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeLen);
    });
  }
  /**
   * 发送请求
   */
  async ajax({ url, method, data = {}, _config = {} }) {
    const config = {
      isLoading: false,
      showError: true,
      ..._config,
    };
    let requestUrl = AppConfig.requsetUrl + url;
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
    let requestError = null;
    let requestRes = {
      data: null,
    };
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
      return null;
    }
    const resultCode = requestRes.data.returnFlag;
    if (resultCode !== 0 || requestRes.data.data == null) {
      if (config.showError) {
        const errMsg = requestRes.data.errorMsg;
        Taro.showToast({
          title: String(errMsg),
          icon: "none",
          duration: 2000,
        });
      }
      return [resultCode, errMsg];
    }
    return [false, requestRes.data.data];
  }

  async get(url, data, _config) {
    const method = "GET";
    return await this.ajax({
      url,
      method,
      data: { ...data, t: new Date().getTime() },
      _config,
    });
  }

  async post(url, data, _config) {
    const method = "POST";
    return await this.ajax({
      url,
      method,
      data,
      _config,
    });
  }
}
export default new Http();
