/**
 * 配置文件
 */
const devConfig: any = {
  requsetUrl: "http://music.163.zhoujie16.cn", // 请求地址
  ftpUrl: "",
};

//生产环境
// const proConfig: any = {
//   requsetUrl: "http://music.163.zhoujie16.cn/",
//   ftpUrl: "",
// };

let config: any = devConfig;
// let config = proConfig;

export default config;
