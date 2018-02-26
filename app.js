//app.js
const AV = require('/libs/av-weapp-min');

// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'l8YRHi4ysPR27IfG3qfH79GM-gzGzoHsz',
  appKey: '1uBnSBt5rOHkE6bvgJqTkMb8',
});

App({
  data:{
    AV:AV
  },

  onLaunch: function () {
    // demo
    this.testStroage()

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({ 
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  // leancloud demo
  testStroage: function(){
    // // 声明一个 Todo 类型
    // var Todo = AV.Object.extend('Todo');
    // // 新建一个 Todo 对象
    // var todo = new Todo();
    // todo.set('title', '工程师周会');
    // todo.set('content', '每周工程师会议，周一下午2点');
    // todo.set('test','test 工程师')
    // todo.save().then(function (todo) {
    //   // 成功保存之后，执行其他逻辑.
    //   console.log('New object created with objectId: ' + todo.id);
    // }, function (error) {
    //   // 异常处理
    //   console.error('Failed to create new object, with error message: ' + error.message);
    // });

    // new AV.Query('ShuXiangSuiYue')
    //   .descending('createTime')
    //   .find()
    //   // .then(items => this.setData({ items }))
    //   .then(function(todo){
    //     console.log('New object created with objectId: ' + todo.length);
    //   }, function(error){
    //     console.error(error)
    //   });
  }
})