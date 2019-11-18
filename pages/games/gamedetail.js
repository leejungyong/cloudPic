// pages/games/gamedetail.js
const WxParse = require('../../wxParse/wxParse.js')
let aid=null
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getGameDetail',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid')
      },
      success:res=>{
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        WxParse.wxParse('detail', 'html', res.data.content, that, 5);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid=options.aid
    this.fetch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})