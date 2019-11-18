//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   advans:['../../icon/daotu.jpg'],
    imgheights:[],
   current:0
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({
      current: e.detail.current
    })
  },
  //获取图片真实宽度 
  imageLoad: function (e) {

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
    console.log(this.data.imgheights)
  },
  //游戏界面
  game(){
    wx.switchTab({
      url: '../games/index',
    })
  },
  //云图
  pic(){
    wx.switchTab({
      url: '../cloudpic/index',
    })

  },
  group(){
    wx.switchTab({
      url: '../group/index',
    })
  },
  wanfa(){
    wx.navigateTo({
      url: './showurl',
    })
  },
  onLoad: function () {

  },
})
