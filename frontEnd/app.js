// app.js  
App({  
    // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）  
    onLaunch: function () {  
      // 可以在这里做一些初始化操作，比如登录态检查、全局数据初始化等  
      console.log('小程序启动');  
    },  
    
    // 当小程序启动，或从后台进入前台显示，会触发 onShow  
    onShow: function (options) {  
      // 在这里可以执行一些页面显示时的操作  
      console.log('小程序显示');  
    },  
    
    // 当小程序从前台进入后台，会触发 onHide  
    onHide: function () {  
      // 在这里可以执行一些页面隐藏时的操作  
      console.log('小程序隐藏');  
    },  
    
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息  
    onError: function (msg) {  
      console.error('小程序发生错误：', msg);  
    },  
    
    // 定义全局数据，可以在其他页面通过 getApp().globalData 访问  
    globalData: {  
      userInfo: null, // 用户信息  
      hasLogin: false // 用户是否已登录  
    }  
    
    // 可以在这里定义更多的全局方法或属性  
    // 例如：  
    // getUserInfo: function() {  
    //   // 获取用户信息的逻辑  
    // }  
  });
  