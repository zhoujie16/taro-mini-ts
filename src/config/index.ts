/**
 * 配置文件
 */
const devConfig = {
  requsetUrl: "https://lincoln-mp-dev.yonyouauto.com", // 请求地址
  ftpUrl: ""
};

//生产环境
const proConfig = {
  requsetUrl: "https://lincoln-mp-dev.yonyouauto.com", 
  ftpUrl: ""
};

let config = devConfig;
// let config = proConfig;

module.exports = config;
