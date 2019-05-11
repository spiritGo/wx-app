const WXAPI = require('./wxapi/main.js')
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    const _this = this;


    wx.getNetworkType({
      success: function(res) {
        const networkType = res.networkType;
        if (networkType === 'none') {
          _this.gloabalData.isConnected = false;
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      },
    })

    wx.onNetworkStatusChange(function(res) {
      if (!res.networkType) {
        _this.gloabalData.isConnected = false;
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete() {
            _this.goStart();
          }
        })
      } else {
        _this.gloabalData.isConnected = true
        _this.goStart()
      }
    })

    WXAPI.queryConfigBatch('mallName,recharge_amount_min,ALLOW_SELF_COLLECTION').then(function(res) {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value)
        });
      }
      // console.log(res)
    })

  },

  goStart() {
    wx.redirectTo({
      url: '/pages/start/start',
    })
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },

  gloabalData: {
    isConnected: true
  }
})