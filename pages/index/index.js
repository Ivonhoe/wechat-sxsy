//index.js
//获取应用实例
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager();
const defaultTitle= '书香岁月'//"圣人请卸妆"
const defaultTable = 'ShuXiangSuiYue'//ShengRenQingXieZhuang'//

var timeSet;
var isStoped = false;

function secondToDate(result) {
  var m = Math.floor((result / 60 % 60));
  var s = Math.floor((result % 60));
  if (m <= 9) {
    m = "0" + m;
  }
  if (s <= 9) {
    s = "0" + s;
  }
  return result = m + ":" + s;
}

Page({
  data: {
    currentTime: "00:00",
    duration: "00:00",
    currentProgress: 0,
    playIcon: '/image/icon_start.png',
    showPlayBarButton: false,
    currentItem: { coverImgUrl: '/image/icon.jpeg', title: defaultTitle },
    items: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    autoplay: false,
  },

  onReady: function () {
    new app.data.AV.Query(defaultTable)
      .descending('createTime')
      .find()
      // .then(items => this.setData({ items }))
      .then(items => this.setData({ items }))
      .catch(console.error);;
  },

  /////////////////////////////////////demo
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShareAppMessage: function () {
    return {
      title: defaultTitle,
      path: '/pages/index/index'
    }
  },

  play: function (e) {
    clearInterval(timeSet);
    var id = e.currentTarget.id
    var item = this.data.items[id]

    var timeCount = 0;
    var coverImgUrl = item.get('coverUrl')
    var playPath64 = item.get('playPath64')
    var id = item.get('id')
    var title = item.get('title')

    this.setData({
      currentItem: {
        id: id,
        title: title,
        playPath64: playPath64,
        coverImgUrl: coverImgUrl,
      },
    })

    wx.playBackgroundAudio({
      dataUrl: playPath64,
      title: title,
      coverImgUrl: coverImgUrl
    })
    // console.log("name:" + JSON.stringify(item) + ",title:" + item.get('title'))

    wx.onBackgroundAudioStop(() => {
      this.resetStatus()
      isStoped = true;

      this.setData({
        playIcon: '/image/icon_start.png'
      })

      // wx.showToast({ title: "on stop" })
    })

    wx.onBackgroundAudioPause(() => {
      // isPause = true;
      this.setData({
        playIcon: '/image/icon_start.png'
      })

      // wx.showToast({ title: "on pause" })
    })

    wx.onBackgroundAudioPlay(() => {
      isStoped = false
      this.setData({
        showPlayBarButton: true,
        playIcon: '/image/icon_pause.png'
      })

      // wx.showToast({ title: "on pla" })
    })

    // isPause = false;
    timeSet = setInterval(() => {
      if (backgroundAudioManager.paused || isStoped) {
        return;
      }

      this.setData({
        currentProgress: Math.floor(backgroundAudioManager.currentTime / backgroundAudioManager.duration * 100),
        currentTime: secondToDate(backgroundAudioManager.currentTime),
        duration: secondToDate(backgroundAudioManager.duration)
      });
    }, 1000)
  },

  resetStatus: function () {
    //clearInterval(timeSet);

    this.setData({
      currentProgress: 0,
      currentTime: "00:00",
    });
  },

  next: function () {
  },

  onPlayBarTap: function () {
    if (backgroundAudioManager.paused) {
      // 暂停状态，继续播放
      backgroundAudioManager.play();

      // 更新状态
      this.setData({
        showPlayBarButton: true,
        playIcon: '/image/icon_pause.png'
      })

      console.log('pause---------play')
    } else if (typeof (this.data.currentItem.playPath64) !== "undefined") {
      // 停止，重新播放，fixme 存在兼容性问题
      if (isStoped) {
        wx.playBackgroundAudio({
          dataUrl: this.data.currentItem.playPath64,
          title: this.data.currentItem.title,
          coverImgUrl: this.data.currentItem.coverImgUrl
        })

        isStoped = false
        this.setData({
          showPlayBarButton: true,
          playIcon: '/image/icon_pause.png'
        })

        console.log('stop---------play')
      } else {
        backgroundAudioManager.pause()

        this.setData({
          playIcon: '/image/icon_start.png'
        })
        console.log('---------pause')
      }
    } else {
      // 没有正在播放，do nothing
      console.log('elsessssss')
    }
  },

  onMoreDetailTap: function(e){
    var id = e.currentTarget.id
    var item = this.data.items[id]

    console.log('-----------------')
  }
})
