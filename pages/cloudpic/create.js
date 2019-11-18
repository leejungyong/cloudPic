// pages/cloudpic/create.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    type: '',
    date: '',
    place: '',
    homepic: 'http://img1.wondfun.com/xuehuiwan/cloudpic/logo.png',
    isChooseHomePic: false,
    sharepic: 'http://img1.wondfun.com/xuehuiwan/cloudpic/sharepic.jpg',
    isChooseSharePic: false
  },

  getName: function(e) {
    
    this.setData({
      name: e.detail.value
    })
  },
  updateType(e) {
    this.setData({
      type: e.detail.value
    })
  },
  //选择日期
  updateTime(e) {
    this.setData({
      date: e.detail.value
    })
  },
  updatePlace(e) {
    this.setData({
      place: e.detail.value
    })
  },
  chooseHomePic() {
    let that = this,
      pic = null
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        pic = res.tempFilePaths[0]

        that.setData({
          homepic: pic,
          isChooseHomePic: true
        })
        console.log(that.data.homepic)
      }
    })
  },
  chooseSharePic() {
    let that = this,
      pic = null
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        pic = res.tempFilePaths[0]
        that.setData({
          sharepic: pic,
          isChooseSharePic: true
        })
        console.log(that.data.isChooseSharePic)
      }
    })
  },
  //保存
  save() {
    let that = this
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=newAct',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        title: that.data.name,
        date: that.data.date,
        address: that.data.place,
        type: that.data.type,
        cover: that.data.homepic,
        sharepic: that.data.sharepic
      },
      success(res) {
        console.log(res.data)
        if (res.data.status) {
          wx.showToast({
            title: res.data.msg,
          })
          let picarr = [],
            aid = res.data.id
            picarr.push(that.data.homepic)
            picarr.push(that.data.sharepic)

          if (picarr.length > 0) {
            for (let i = 0; i < picarr.length; i++) {
              // if(that.data.isChooseHomePic)
              // console.log(picarr[i].indexOf('http://tmp/'))test5
              if (picarr[i].indexOf('http://tmp/')!=-1){
                console.log(i)
                wx.uploadFile({
                url: app.globalData.config.apiUrl + 'uploadalbum.php',
                filePath: picarr[i],
                name: 'file',
                formData: {
                  aid: aid,
                  openid: wx.getStorageSync('openid'),
                  index: i+1
                },
                success: res => {
                  console.log(JSON.parse(res.data))
                },
                fail: res => {}
              })
              }
              
            }
            wx.redirectTo({
              url: './uploadhome?aid=' + aid,
            })
          }

        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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