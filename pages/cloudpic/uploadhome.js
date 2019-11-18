// pages/cloudpic/uploadhome.js
const app = getApp()
let aid = null,
  total = null,
  who=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    allAlbum: [],
    total: 0,
    act: null,
    current: 0, //swiper中当前图片的index
    curIndex: 0, //触底index
    showBig: false,
    imgheights: [],
    currentpage: 0,
    systemInfo: null, //获取设备信息
    toView: null,
    isPhotoGraph: false,
    pwd: null,
    towho:null,
    currentTab:-1,
    cat:null
  },
  //切换导航
  navbarTap(e) {
    let that = this
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let catid = that.data.currentTab == -1 ? 0 : that.data.cat[that.data.currentTab].catid
    that.fetch(catid)
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
  //
  updatePwd(e) {
    console.log(e)
    this.setData({
      pwd: e.detail.value
    })
  },
  //确认登录
  surePwd() {
    if (this.data.pwd == this.data.act.pwd) {
      this.setData({
        isPhotoGraph: false
      })
      wx.setStorageSync(aid+'pwd', this.data.pwd)
    } else {
      this.setData({
        isPhotoGraph: true
      })
      wx.showToast({
        title: '请输入正确的相册密码',
        icon: 'none'
      })
    }
  },
  //获取设备的信息
  getSysInfo() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          systemInfo: res
        })
      },
    })
  },

  //跳转至编辑
  toEdit() {
    wx.navigateTo({
      url: './edit?aid=' + aid,
    })
  },
  fetch(catid) {
    let that = this
    
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.config.apiUrl + 'index.php?act=getAlbum',
      method: "POST",
      data: {
        aid: aid,
        catid:catid
      },
      success: res => {
        console.log(res.data)
        let [...arr] = JSON.parse(JSON.stringify(res.data.allAlbum))
        arr = arr.map((item, index) => {
          item.checked = false
          item.url = item.url + '-w640'
          return item
        })
        if (who == 'photograph') {
          let session = aid + 'pwd'
          console.log(session)
          if (wx.getStorageSync(session)) {
            if (wx.getStorageSync(session) == res.data.act.pwd) {
              that.setData({
                isPhotoGraph: false
              })
            } else {
              that.setData({
                isPhotoGraph: true
              })
            }
          } else {
            that.setData({
              isPhotoGraph: true
            })
          }
        } else {
          that.setData({
            isPhotoGraph: false
          })
        }
        that.setData({
          list: res.data.allAlbum,
          act: res.data.act,
          allAlbum: arr,
          total: res.data.total,
          cat:res.data.cat
        })

        wx.hideLoading()
      }
    })
  },
  //查看大图
  toBigImage() {
    let that = this
    that.setData({
      showBig: true
    })
  },
  //查看原图
  lookOrigin() {
    let arr = this.data.allAlbum,
      index = this.data.current
    arr[index].checked = true
    arr[index].url = arr[index].url.substring(0, arr[index].url.length - 5)
    this.setData({
      allAlbum: arr
    })
  },
  //获取图片真实宽度 
  imageLoad: function(e) {
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },

  //左滑右滑查看大图
  bindchange: function(e) {
    let that = this
    console.log(e.detail.current)
    this.setData({
      current: e.detail.current,
      toView: 'pic' + e.detail.current,
      curIndex: e.detail.current
    })
    if (e.detail.current + 1 >= that.data.total) {
      that.setData({
        currentpage: that.data.currentpage + 1
      })
      that.fetch()
    }
  },
  close() {
    this.setData({
      showBig: false
    })
  },
  //上传照片
  upload() {
    this.choosePics()
  },
  choosePics() {
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let pics = res.tempFilePaths
        that.uploadPic(0, that, pics)
      }
    })

  },
  uploadPic: (index, that, arr) => {
    var len = arr.length
    var upload_task = wx.uploadFile({
      url: app.globalData.config.apiUrl + 'uploadalbum.php',
      filePath: arr[index],
      name: "file",
      formData: {
        aid: aid,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log("上传成功")
        console.log(res.data)
        index++;

      },
      fail: (res) => {
        console.log("上传失败")
        console.log(res.data)

      },
      complete: function(res) {
        if (index == len) {
          that.setData({
            currentTab: 0
          })
          that.fetch()

          console.log(index)
          wx.showToast({
            title: '上传完成',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.log("长度小于数组长度")
          console.log('正在上传第' + index + '张');
          that.uploadPic(index, that, arr) //递归

        }
      }
    })
  },

  //触底加载
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
  onLoad: function(options) {
    aid = options.aid
     who = options.toWho
     this.setData({
       towho:who
     })
    this.getSysInfo()
    let catid = this.data.currentTab == -1 ? 0 : this.data.cat[that.data.currentTab].catid
    console.log(catid)
    this.fetch(catid)


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
      return {
        title: that.data.act.title + '图片直播',
        path: '/pages/cloudpic/splash?aid=' + that.data.act.aid + '&toWho=guest',
        imageUrl: that.data.act.sharepic
      }
    }
  }
})