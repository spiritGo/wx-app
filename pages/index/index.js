const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    noticeList: [],
    goodsCategory: [],
    category_box_width: 0,
    category_current_item: 0,
    banners: [],
    goods: [],
    kanjiaGoodsMap: [],
    kanjiaList: [],
    pingtuanGoods: [],
    curPage: 1,
    pageSize: 20,
    goodlist: [],
    nodata: false

  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  getNotice() {
    const _this = this;
    WXAPI.noticeList({
      pageSize: 5
    }).then(function(res) {
      if (res.code === 0) {
        _this.setData({
          noticeList: res.data.dataList
        })
        // console.log(_this.data.noticeList)
      }
    })
  },

  getGoodsCategory() {
    const _this = this;
    WXAPI.goodsCategory().then(function(res) {
      // console.log(res)
      if (res.code == 0) {
        var lineCount = Math.ceil(res.data.length / 2)
        _this.setData({
          goodsCategory: res.data,
          category_box_width: lineCount * 150
        })
      }
    })
  },

  categoryClick(e) {
    this.setData({
      category_current_item: e.currentTarget.id,
      curPage: 1,
      inputVal: ''
    })

    this.goods(this.data.category_current_item, false)
    // console.log(e)
  },

  getBanners() {
    const _this = this;
    WXAPI.banners({
      type: 'new'
    }).then(function(res) {
      // console.log(res)
      if (res.code == 0) {
        _this.setData({
          banners: res.data
        })
      }
    })
  },

  getGoods() {
    const _this = this;
    WXAPI.goods({
      recommendStatus: 1
    }).then(function(res) {
      if (res.code == 0) {
        _this.setData({
          goods: res.data
        })

        // console.log(_this.data.goods)
      }
    })
  },

  getKanjiaList() {
    WXAPI.kanjiaList().then(res => {
      // console.log(res)
      if (res.code == 0) {
        this.setData({
          kanjiaGoodsMap: res.data.goodsMap,
          kanjiaList: res.data.result
        })
      }
    })
  },

  pingtuanGoods() {
    WXAPI.goods({
      pingtuan: true
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        this.setData({
          pingtuanGoods: res.data
        })
      }
    })
  },

  goods(categoryId, append) {

    if (categoryId == 0) {
      categoryId = '';
    }

    // categoryId = parseInt(categoryId)

    wx.showLoading({
      'mask': true
    })

    WXAPI.goods({
      categoryId: categoryId,
      nameLike: this.data.inputVal,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    }).then(res => {
      wx.hideLoading();
      // console.log(categoryId, this.data.inputVal, this.data.curPage, this.data.pageSize)
      if (res.code == 0) {
        let goods = [];
        if (append) {
          goods = this.data.goodlist;
        }

        goods = goods.concat(res.data)
        this.setData({
          goodlist: goods,
          nodata: false
        })
      } else {
        let newData = {
          nodata: true
        }

        if (!append) {
          newData.goodlist = []
        }
        this.setData(newData)
      }
    })
  },

  toSearch() {
    this.setData({
      curPage: 1,
      category_current_item: 0
    })
    this.goods(this.data.category_current_item)
  },

  toDetailTap(e) {
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    this.getNotice();
    this.getGoodsCategory();
    this.getBanners();
    this.getGoods();
    this.getKanjiaList();
    this.pingtuanGoods();
    this.goods(this.data.category_current_item, false);
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
    this.setData({
      curPage: this.data.curPage + 1
    })
    this.goods(this.data.category_current_item, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})