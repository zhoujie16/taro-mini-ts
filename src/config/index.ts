/**
 * 配置文件
 */
const devConfig: any = {
  requsetUrl: "https://lincoln-mp-dev.yonyouauto.com", // 请求地址
  ftpUrl: "",
};

//生产环境
const proConfig: any = {
  requsetUrl: "https://lincoln-mp-dev.yonyouauto.com",
  ftpUrl: "",
};

let config: any = devConfig;
// let config = proConfig;

export default config;
