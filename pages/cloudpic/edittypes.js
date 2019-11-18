// pages/cloudpic/edittypes.js
const app=getApp()
let aid=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      newName:'',
      isFocus:false,
      current:null
  },
  //聚焦时触发
  showSave(e){
    this.setData({
      isFocus:true,
      current:e.currentTarget.dataset.idx
    })
  },
  showDelete(e) {
    this.setData({
      isFocus: false
    })
  },
  //新分类的名字
  getTypeName(e){
    this.setData({
      newName:e.detail.value
    })
  },
  
  editName(e){
    let index=e.currentTarget.dataset.idx
    let arr=this.data.list
    arr[index].name=e.detail.value
    this.setData({
      list:arr
    })
  },
  saveEdit(e){
    let that=this
    let index = e.currentTarget.dataset.idx
    if (that.data.list[index].name==''){
      wx.showToast({
        title: '分类名称不能为空！',
        icon:'none'
      })
    }else{
      wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=editCat',
      method:'POST',
      data:{
        aid: aid,
        openid: wx.getStorageSync('openid'),
        catid:that.data.list[index].catid,
        name: that.data.list[index].name
      },
      success:res=>{
        console.log(res.data)
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
    }
    
  },
  //新增分类
  add(){
    let that=this
    console.log(that.data)
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=newCat',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid'),
        name:that.data.newName
      },
      success:res=>{
        console.log(res.data)
        if(res.data.status){
          this.fetch()
        }
        wx.showToast({
          title: res.data.msg,
        })
      }
    })

  },

  //删除
  deleteType(e){
    let that=this
    let index=e.currentTarget.dataset.idx
    wx.showModal({
      title: '',
      content: '确定删除该分类吗？',
      success:res=>{
        if(res.confirm){
          wx.request({
            url: app.globalData.config.apiUrl+'index.php?act=delCat',
            method: 'POST',
            data: {
              openid: wx.getStorageSync('openid'),
              catid: that.data.list[index].catid
            },
            success:res=>{
              console.log(res.data)
              if(res.data.status){
                that.fetch()
              }
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
  fetch(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=getCat',
      method:'POST',
      data:{
        aid:aid,
        openid:wx.getStorageSync('openid')
      },
      success:res=>{
        console.log(res.data)
        that.setData({
          list:res.data
        })

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
    let pages=getCurrentPages(),
    prepage=pages[pages.length-2]
    prepage.fetch(0)
    
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