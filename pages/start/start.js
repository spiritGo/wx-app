// pages/start/start.js
const CONFIG = require("../../config.js");
const WXAPI = require("../../wxapi/main.js");
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },

  /**
   * 获取banner图片
   */
  getBanner() {
    var _this = this;

    var app_show_pic_version = wx.getStorageSync('app_show_pic_version');
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      WXAPI.banners({
          type: "app"
        })
        .then(function(res) {
          if (res.code === 0) {
            _this.setData({
              banners: res.data,
              swiperMaxNumber: res.data.length
            });
          } else {
            wx.switchTab({
              url: "/pages/index/index"
            });
          }
          // console.log(res);
        })
        .catch(function(e) {
          wx.switchTab({
            url: "/pages/index/index"
          });
        });
    }
  },

  goIndex(e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formid: e.detail.formid
    })

    if (app.gloabalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version,
      })

      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.showToast({
        title: '当前无可用网络',
        icon: 'none'
      })
    }
  },

  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    })

    this.getBanner();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});