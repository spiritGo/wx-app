// pages/shop-cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCart: {},
    selectAll: false
  },

  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  select(e) {
    const curIndex = e.currentTarget.dataset.index
    const item = this.data.shopCart.shopList[curIndex];
    var active = item.active;
    item.active = !active;
    this.data.shopCart.shopList.splice(curIndex, 1, item)
    // console.log(this.data.shopCart)
    this.setData({
      shopCart: this.data.shopCart
    })

    wx.setStorage({
      key: 'shopCarInfo',
      data: this.data.shopCart
    })

    this.selectAll();
    this.totalPrice();
  },

  jiaTap(e) {
    var idx = e.currentTarget.dataset.index
    var shopCart = this.data.shopCart
    var item = shopCart.shopList[idx]

    item.shopNum++;
    shopCart.shopNum++;

    this.setData({
      shopCart: shopCart
    })

    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCart,
    })

    this.totalPrice();
    // console.log(shopCart.shopList)

  },

  jianTap(e) {
    var idx = e.currentTarget.dataset.index
    var shopCart = this.data.shopCart
    var item = shopCart.shopList[idx]

    if (item.shopNum > 1) {
      item.shopNum--;
      shopCart.shopNum--;

      this.setData({
        shopCart: shopCart
      })

      wx.setStorage({
        key: 'shopCarInfo',
        data: shopCart,
      })
    }

    this.totalPrice();
  },

  totalPrice() {
    var shopCart = this.data.shopCart
    var list = shopCart.shopList
    var totalPrice = 0

    for (var item of list) {
      if (item.active) {
        totalPrice += item.shopNum * item.price;
      }
    }

    shopCart.totalPrice = totalPrice;
    this.setData({
      shopCart: shopCart
    })

    // console.log(shopCart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;

    // 设置头部标题
    wx.setNavigationBarTitle({
      title: '购物车',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const _this = this;
    // 获取购物车信息
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        _this.setData({
          shopCart: res.data
        })
        _this.selectAll();
        _this.totalPrice();
      },
    })
  },

  selectAll() {
    var list = this.data.shopCart.shopList;
    // console.log()
    var active = list.every(function(val, idx) {
      return val.active
    })

    this.setData({
      selectAll: active
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})