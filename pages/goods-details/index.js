// pages/goods-details/index.js
const WXAPI = require('../../wxapi/main.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const wxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: [],
    hideShopPopup: true,
    buyNum: 0,
    buyNumMax: 0,
    buyNumMin: 1,
    shopCarInfo: {},
    shopNum: 0,

  },

  async getGoodsDetailAndkanjiaInfo(goodsId) {
    const _this = this;
    const goodsDetailRes = await WXAPI.goodsDetail(goodsId)
    const goodsKanjiaSetRes = await WXAPI.kanjiaSet(goodsId)
    // console.log(goodsDetailRes, goodsKanjiaSetRes)
    if (goodsDetailRes.code == 0) {
      _this.setData({
        goodsDetail: goodsDetailRes.data,
        buyNumMax: goodsDetailRes.data.basicInfo.stores
      })
      // console.log(this.data.buyNumMax)
    }

    if (goodsKanjiaSetRes.code == 0) {
      _this.setData({
        goodsKanjia: goodsKanjiaSetRes.data
      })
    }

    if (goodsDetailRes.data.basicInfo.pingtuan) {
      _this.pingtuanList(goodsId)
      _this.pingtuanSet(goodsId)
      // console.log(goodsId)
    }

    wxParse.wxParse('article', 'html', goodsDetailRes.data.content, _this, 5)
  },

  pingtuanList(goodsId) {
    WXAPI.pingtuanList(goodsId).then(res => {
      // console.log(res)
    })
  },

  pingtuanSet(goodsId) {
    WXAPI.pingtuanSet(goodsId).then(res => {
      // console.log(res)
      if (res.code == 0) {
        this.setData({
          pingtuanSet: res.data
        })
      }
      // console.log(this.data.goodsDetail)
    })
  },

  toShopCar() {
    this.setData({
      hideShopPopup: false,
      buyNum: 1
    })
  },

  cacleShop() {
    this.setData({
      hideShopPopup: true
    })
  },

  numjia() {
    if (this.data.buyNum < this.data.buyNumMax) {
      var curNum = this.data.buyNum;
      curNum++;
      this.setData({
        buyNum: curNum
      })

      console.log()
    }
  },
  numjian() {
    if (this.data.buyNum > this.data.buyNumMin) {
      var curNum = this.data.buyNum;
      curNum--;
      this.setData({
        buyNum: curNum
      })
    }
  },

  addToCart() {
    var shopCarInfo = this.bulidShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum,
      hideShopPopup: true
    })

    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo,
    })

    // console.log(shopCarInfo)

    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })

  },

  /**
   * 组建购物车信息
   */
  bulidShopCarInfo() {
    var shopCarMap = {}

    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.price = this.data.goodsDetail.basicInfo.price;
    shopCarMap.totalPrice = this.data.totalPrice;
    shopCarMap.shopNum = this.data.buyNum
    // console.log(shopCarMap.shopNum)

    var shopCarInfo = this.data.shopCarInfo
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0
    }

    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = []
    }

    var hasSameInfoIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmp = shopCarInfo.shopList[i];
      if (tmp.goodsId == shopCarMap.goodsId) {
        shopCarMap.shopNum = tmp.shopNum + shopCarMap.shopNum
        hasSameInfoIndex = i;
        console.log(tmp.shopNum, shopCarMap.shopNum)
        break
      }

    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNum

    if (hasSameInfoIndex > -1) {
      shopCarInfo.shopList.splice(hasSameInfoIndex, 1, shopCarMap)
    } else {
      shopCarInfo.shopList.push(shopCarMap)
    }

    return shopCarInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const _this = this
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        console.log(res)
        _this.setData({
          shopNum: res.data.shopNum,
          shopCarInfo: res.data
        })
      },
    })
    this.getGoodsDetailAndkanjiaInfo(options.id)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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