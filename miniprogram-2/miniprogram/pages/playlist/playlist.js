// pages/playlist/playlist.js
import regeneratorRuntime from '../../utlis/runtime.js'
//控制每次取出条数
const MAX_LIMIT = 15
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
        swinperImgUrl:[
  //         {
  //     url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
  //        },
  //        {
  //   url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
  // },
  // {
  //   url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
  // }

        ],
    playlist: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this._getPlaylist()
    this._getSwiper()
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
    this.setData({
      // 清空数据
      playlist:[]
      
    })
    // 刷新后重新请求数据
    this._getPlaylist()
    this._getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getPlaylist(){
    //显示 一个loading加载框
    wx.showLoading({
      title: '加载中',
    })
    // 调用云函数
    wx.cloud.callFunction({
      // 云函数名
      name: 'music',
      // 要传递的参数
      data: {
        //  第一次从第领条开始
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        // 具体调用的而是music里的那个
        $url:'playlist'

      }
    }).then((res) => {
      // console.log(res)
      // 把每次请求的15条拼接到playlist里
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
        
      })
      // 当数据请求成功后停止下拉刷新这个动作
      wx.stopPullDownRefresh()
      //  隐藏加载
      wx.hideLoading()
    })
  },
  // 获取轮播图片
  _getSwiper(){
   db.collection('swiper').get().then((res)=>{
     this.setData({
       swinperImgUrl:res.data
     })
   })
  }
})