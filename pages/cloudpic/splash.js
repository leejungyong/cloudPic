// pages/cloudpic/splash.js
const app=getApp()
let aid=null,toWho=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDefault:true,
    imgurl:''
  },
  gotoHome(){
    wx.navigateTo({
      url: './uploadhome?aid='+aid+'&toWho='+toWho,
    })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl +'index.php?act=getSplashPic',
      method:'POST',
      data:{
        aid:aid,
        toWho:toWho
      },
      success:res=>{
        console.log(res.data)
        if(res.data){
          if (res.data != "http://img1.wondfun.com/xuehuiwan/cloudpic/logo.png"){
            that.setData({
              imgurl: res.data,
              isDefault: false
            })
          }else{
            that.setData({
              isDefault: true
            })
          }
       
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    aid=options.aid
    toWho=options.toWho
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