// pages/cloudpic/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGetUserInfo:false
  },
  //初始化获取用户信息
  onGotUserInfo(e) {
    let that=this
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '程序需要您授权后才可正常运行',
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=syncUser',
        data: {
          openid: wx.getStorageSync('openid'),
          unionid: wx.getStorageSync('unionid'),
          avatar: e.detail.userInfo.avatarUrl,
          nick: e.detail.userInfo.nickName
          // nick: util.base64_encode(e.detail.userInfo.nickName)
        },
        method: 'POST',
        success: (res) => {
          that.setData({
            isGetUserInfo: true
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    }
  },

  //获取用户授权
  getSetting(){
    let that=this
    wx.getSetting({
      success(res){
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isGetUserInfo:true
          })
        }
      }
    })
  },
  //我的云图
  toMyCloudPic(){
    wx.navigateTo({
      url: './mycloudpic',
    })
  },
  //创建云图
  toCreate(){
    wx.navigateTo({
      url: './create',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSetting()
    wx.setNavigationBarTitle({
      title: '云图',
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
  onShareAppMessage: function () {

  }
})