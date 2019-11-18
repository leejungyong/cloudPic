// pages/cloudpic/uploadhome.js
const app = getApp()
let aid = null, allAlbum = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    act: null,
    curIndex: 0, //触底index
    toView: null,
    cat: [],
    currentTab: -1, //当前
    showCheckbox: false, //是否显示复选框
    isChooseAll: true, //显示全选还是取消全选
    isGrey: false, //是否置灰
 
  },
  toBigImage(e){
    let idx=e.currentTarget.dataset.idx
    let arr=[]
    this.data.list.map((item)=>{
      arr.push(item.url)
    })
    wx.previewImage({
      urls:arr,
      current:this.data.list[idx].url
    })
  },
  //取消编辑
  cancelEdit(){
    let arr = this.data.list
    arr = arr.map((item, index) => {
      item.checked = false
      return item
    })
    this.setData({
      showCheckbox: false,
      list: arr,
      isGrey: true
    })
  },
  //点击全部
  clickAll() {
    let that = this
    that.setData({
      currentTab: -1
    })
    let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
    that.fetch(catid)
  },
  //切换tab
  navbarTap(e) {
    let that = this
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
    that.fetch(catid)
  },

  //可见
  canLook(e) {
    let index = e.currentTarget.dataset.idx,
      that = this,
      arr = that.data.list

    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=updatePicDisplay',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        picid: that.data.list[index].pid,
        flag: -1
      },
      success: res => {
        console.log(res.data)
        if (res.data.status) {
          arr[index].hidden = -1
          that.setData({
            list: arr
          })
        }
      }
    })
  },
  //不可见
  hide(e) {
    let index = e.currentTarget.dataset.idx,
      that = this,
      arr = that.data.list

    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=updatePicDisplay',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        picid: that.data.list[index].pid,
        flag: 0
      },
      success: res => {
        console.log(res.data)
        if (res.data.status) {
          arr[index].hidden = 0
          that.setData({
            list: arr
          })
        }
      }
    })
  },

  //长按图片
  longPress(e) {
    let idx = e.currentTarget.dataset.idx,
      arr = this.data.list
    arr[idx].checked = true
    this.setData({
      list: arr,
      showCheckbox: true,
      isGrey: false
    })
  },
  //勾选复选框
  collectSelect(e) {
    let idx = e.currentTarget.dataset.idx,
      arr = this.data.list
    arr[idx].checked = !arr[idx].checked
    this.setData({
      list: arr
    })
    //判断是否都没有选中，按钮置灰
    let flex = arr.every((item, index) => {
      return item.checked == false
    })
    if (flex) {
      this.setData({
        isGrey: true
      })
    } else {
      this.setData({
        isGrey: false
      })
    }

  },
  //点击全选
  chooseAll() {
    let arr = this.data.list
    arr = arr.map((item, index) => {
      item.checked = true
      return item
    })
    this.setData({
      isChooseAll: false,
      list: arr,
      isGrey: false
    })
  },
  //取消全选
  cancelAll() {
    let arr = this.data.list
    arr = arr.map((item, index) => {
      item.checked = false
      return item
    })
    this.setData({
      isChooseAll: true,
      list: arr,
      isGrey: true
    })
  },
  //删除所选项
  deleteChoose() {
    if (!this.data.isGrey) {
      wx.showModal({
        title: '',
        content: '确认删除所选项吗？',
        success: res => {
          if (res.confirm) {
            let movearr = [],
              that = this
            this.data.list.map((item, index) => {
              if (item.checked) {
                movearr.push(item.pid)
              }
            })
            console.log(movearr)
            wx.request({
              url: app.globalData.config.apiUrl + 'index.php?act=batchDelPic',
              method: 'POST',
              data: {
                arr: movearr,
                openid: wx.getStorageSync('openid')
              },
              success: res => {
                console.log(res.data)
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
                that.fetch(catid)
              }
            })
          }
        }
      })
    }


  },
  //移至某一目录下
  moveTo(e) {
    if (!this.data.isGrey) {
      let movearr = [], that = this
      let catid = this.data.cat[parseInt(e.detail.value)].catid
      this.data.list.map((item, index) => {
        if (item.checked) {
          movearr.push(item.pid)
        }
      })
      wx.request({
        url: app.globalData.config.apiUrl + 'index.php?act=batchMovePic',
        method: 'POST',
        data: {
          catid: catid,
          arr: movearr,
          openid: wx.getStorageSync('openid')
        },
        success: res => {
          // console.log(res.data)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
          that.fetch(catid)
          // that.fetch()
        }
      })
    }

  },
  //更改标题
  updateTitle(e) {
    console.log(e)
    let that = this,
      actInfo = that.data.act
    actInfo.title = e.detail.value
    that.setData({
      act: actInfo
    })
  },
  //更改地点
  updateAddress(e) {
    console.log(e)
    let that = this,
      actInfo = that.data.act
    actInfo.address = e.detail.value
    that.setData({
      act: actInfo
    })
  },
  //更改时间
  updateDate(e) {
    console.log(e)
    let that = this,
      actInfo = that.data.act
    actInfo.date = e.detail.value
    that.setData({
      act: actInfo
    })
  },
  //跳转至编辑分类页面
  editTypes() {
    wx.navigateTo({
      url: './edittypes?aid=' + aid,
    })
  },
  fetch(catid) {
    console.log(catid)
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getAlbum',
      method: "POST",
      data: {
        aid: aid,
        catid: catid,
        action:'edit'
      },
      success: res => {
        console.log(res.data)
        let arr = res.data.allAlbum.map((item, index) => {
          item.checked = false
          return item
        })
        that.setData({
          list: arr,
          act: res.data.act,
          total: res.data.total,
          cat: res.data.cat
        })
        allAlbum = arr
        wx.hideLoading()
      }
    })
  },

  //触底加载图片
  lower() {
    let that = this
    if (that.data.curIndex + 30 <= that.data.total) {
      that.setData({
        curIndex: that.data.curIndex + 30
      })
    } else {
      that.setData({
        curIndex: that.data.total
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid = options.aid
    let that = this
    let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
    console.log(catid)
    that.fetch(catid)

  },
  postData(){
    let that=this
    wx.request({
      url: app.globalData.config.apiUrl+'index.php?act=editAct',
      method:'POST',
      data:{
        act:that.data.act,
        openid:wx.getStorageSync('openid')
      },
      success:res=>{
        let pages = getCurrentPages()
        let prepage = pages[pages.length - 1]
        prepage.fetch(0)
      }
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
    this.postData()
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
    let that = this
    // if(res.from=='button'){}
    return {
      title: that.data.act.title + '图片直播',
      path: '/pages/cloudpic/uploadhome?aid=' + aid,
      imageUrl: that.data.act.sharepic
    }
  }
})