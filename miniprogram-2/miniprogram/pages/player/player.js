// pages/player/player.js
// 把本存储数据存在数组里
let musiclist = []
// 正在播放的index
let nowplayingIndex = 0
// 获取全局位移的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 调用全局属性
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isplaying: false, //不播放
    isLyricShow: false, //当前歌词是否显示
    lyric: '',
    isSame:false,//当前是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    nowplayingIndex = options.index
    // 取出本地存储数据
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)


  },
  // 加载当前的数据
  _loadMusicDetail(musicId) {

    if (musicId == app.getPlayingMusicId()){
      this.setData({
        isSame:true,
      })
    }else{
      this.setData({
        isSame: false,
      })
    }
    if (!this.data.isSame){
      
      // 停止上一首在加载下一首
      backgroundAudioManager.stop()
    }
    
    let music = musiclist[nowplayingIndex]
    // console.log(music)
    // 把音乐名称放到他Bar上
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isplaying: false,
    })
    
    // 把当前歌曲播放ID设置为全局的
    app.setPlayingMusicId(musicId)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',

      }
    }).then((res) => {
      // console.log(res)
      // console.log(JSON.parse(res.result))
      let result = JSON.parse(res.result)
      // vip歌曲无法播放
      if(result.data[0].url==null){
           wx.showToast({
             title: '无权限播放',
           })
           return
      }
      if(!this.data.isSame){
        // 音乐播放地址 下面两个必须同时否则报错
        backgroundAudioManager.src = result.data[0].url
        // 标题
        backgroundAudioManager.title = music.name
        // 专辑图片
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        // 歌手信息
        backgroundAudioManager.singer = music.ar[0].name
        // 专辑名称
        backgroundAudioManager.epname = music.al.name
        // 保存播放历史
        this.savePlayHistory()

      }
      
      this.setData({
        isplaying: true
      })
      wx.hideLoading()
      //  加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',

        }
      }).then((res) => {
        // console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  togglePlaying() {
    // 正在播放
    if (this.data.isplaying) {
      // 暂停
      backgroundAudioManager.pause()
    } else {
      // 播放
      backgroundAudioManager.play()

    }
    this.setData({
      isplaying: !this.data.isplaying
    })
  },
  // 上一首
  onPrev() {
    nowplayingIndex--
    if (nowplayingIndex < 0) {
      nowplayingIndex = musiclist.length - 1

    }
    this._loadMusicDetail(musiclist[nowplayingIndex].id)
  },
  // 下一首
  onNext() {
    nowplayingIndex++
    if (nowplayingIndex === musiclist.length) {
      nowplayingIndex = 0

    }
    this._loadMusicDetail(musiclist[nowplayingIndex].id)
  },
  // 点击切换歌词
  onChangeLyricShow() {

    this.setData({
      isLyricShow: !this.data.isLyricShow

    })
  },
  // 歌词联动
  timeUpdate(event) {
    // console.log(event.detail.currentTime)

    // 获取自定义子组件定义一个updata方法
    this.selectComponent('.lyric').updata(event.detail.currentTime)

  },
  // 音乐控制器播放时
  onPlay() {
    this.setData({
      isplaying: true,
    })

  },
  // 音乐控制器暂停时
  onPause() {
    this.setData({
      isplaying: false,
    })
  },
//  保存歌曲播放历史
savePlayHistory(){
  // 当前正在播放的歌曲
   const music=musiclist[nowplayingIndex]
  const openid = app.globalData.openid
  const history = wx.getStorageSync(openid)
  let bHave=false
  for(let i=0,len=history.length;i<len;i++){
    if (history[i].id == music.id){
      bHave=true
      break
       }
  }
  if(!bHave){
 history.unshift(music)
 wx.setStorage({
   key: openid,
   data: history,
 })
  }
 
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