// pages/cloudpic/mycloudpic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  //编辑页面
  toEdit(e) {
    let idx = e.currentTarget.dataset.idx
    let aid = this.data.list[idx].aid
    wx.navigateTo({
      url: './edit?aid=' + aid,
    })
  },

  //指派
  toAssign(e) {
    let idx = e.currentTarget.dataset.idx
    let ops = this.data.list[idx]
    wx.navigateTo({
      url: './shareto?ops=' + JSON.stringify(ops),
    })
  },
  //删除
  deleteAct(e) {
    let that=this
    wx.showModal({
      title: '',
      content: '确定要删除该活动吗？',
      success: res => {
        if (res.confirm) {
          let idx = e.currentTarget.dataset.idx
          let aid = that.data.list[idx].aid
          wx.request({
            url: app.globalData.config.apiUrl + 'index.php?act=delAct',
            method: 'POST',
            data: {
              aid: aid,
              openid: wx.getStorageSync('openid')
            },
            success: res => {
              console.log(res.data)
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              that.fetch()
            }
          })
        }
      }
    })

  },
  fetch() {
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getMyAlbumList',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        console.log(res.data)
        this.setData({
          list: res.data
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetch()
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
  onShareAppMessage: function(res) {
    let that = this
    if (res.from == 'button') {
      console.log(res.target)
      let idx = res.target.dataset.idx
      return {
        title: that.data.list[idx].title + '图片直播',
        path: '/pages/cloudpic/splash?aid=' + that.data.list[idx].aid + '&toWho=guest',
        imageUrl: that.data.list[idx].sharepic
      }
    }

  }
})