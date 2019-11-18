// pages/cloudpic/shareto.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actObj:null
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    this.setData({
      actObj:JSON.parse(options.ops)
    })
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
  onShareAppMessage: function (res) {
    let that = this
    if (res.from == 'button') {
      
      let idx = res.target.dataset.idx
      return {
        title: that.data.actObj.title + '图片直播',
        path: '/pages/cloudpic/splash?aid=' + that.data.actObj.aid+'&toWho=photograph'
      }
    }
  }
})