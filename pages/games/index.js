// pages/games/index.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typelist:[{icon:'',name:'eee'}],
    top10:[]
  },
  //子列表页
  toList(e){
    let idx = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: './gamelist?catid=' + this.data.typelist[idx].catid + '&title=' + this.data.typelist[idx].catname,
    })
  },
  //游戏详情
  toDetail(e){
    let idx=e.currentTarget.dataset.idx
    wx.navigateTo({
      url: './gamedetail?aid='+this.data.top10[idx].aid,
    })
  },
  fetch(){
    let that=this
    wx.request({
      url:app.globalData.config.apiUrl+ 'index.php?act=getGameList',
      method:'POST',
      data:{},
      success:res=>{
        console.log(res.data)
        that.setData({
          typelist:res.data.cat,
          top10:res.data.top10
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetch()
    wx.setNavigationBarTitle({
      title: '游戏',
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