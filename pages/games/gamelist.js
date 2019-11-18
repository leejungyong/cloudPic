// pages/games/gamelist.js
let catid=null,title=null
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    currentpage:0
  },
  //游戏详情
  toDetail(e) {
    let idx = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: './gamedetail?aid=' + this.data.list[idx].aid,
    })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl +'index.php?act=getGameSubList',
      method:'POST',
      data:{
        catid:catid,
        currentpage:that.data.currentpage
      },
      success:res=>{
        console.log(res.data)

        let arr=[]
        arr=that.data.list.length==0?res.data.list:that.data.list.concat(res.data.list)
        that.setData({
          list:arr
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    catid=options.catid
    title =options.title
    wx.setNavigationBarTitle({
      title: title,
    })
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
    let that=this
    that.setData({
      currentpage:that.data.currentpage+1
    })
    that.fetch()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})