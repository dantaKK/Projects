/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1740482474854_8983';

  // add your middleware config here
  config.middleware = [];
  // 安全性
   config.security={
     csrf:{
       enable:false,
       ignoreJSON:true
     },
     domainWhiteList:['*']
   }
   // 加密
    config.jwt={
      secret:'!%xckznbxck'
    }
    
   // 
   exports.sequelize={
     dialog:'mysql',
     host:'localhost',
     port:'3306',
     database:'zhangben',
     username:'root',
     password:'xck167943',
     define:{
       timestamps:false, // 关闭时间戳
       freezeTableName:true, // 关闭复数
       underscored:true // 开启下划线
     }
     
    }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
