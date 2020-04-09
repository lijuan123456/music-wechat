// components/lyric/lyric.js
// 当前歌词高度
let lyricHeight=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false,
    },
    lyric:String,
    
  },
  // 监听器 歌词
  observers:{
    lyric(lrc){
      // 无歌词
      if (lrc=='暂无歌词'){
         this.setData({
           lrcList:[
             {
               lrc,
               time:0,
               
             }
           ],
           nowLyricIndex:-1
         })
      }else{
        this._parseLyric(lrc)
      }
      
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],
    nowLyricIndex:0, //选中歌词索引
    scrollTop:0,//滚动条
  },
  lifetimes:{
    // 生命周期
    ready(){
    //  px rpx换算 wx.getSystemInfo获取当前手机的一些信息
    wx.getSystemInfo({
      success: function(res) {
        
        // 1rpx大小
        lyricHeight=res.screenWidth/750*64
      },
    })
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 歌词联动
    updata(currentTime){
      // console.log(currentTime)
      let lrcList = this.data.lrcList
      // console.log(lrcList)
      if (lrcList.length==0){
       
          return
      }
      // 判断歌词到最后几秒是没有歌词高亮
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }
      for (let i = 0, len=lrcList.length;i<len;i++){
       
        if (currentTime <=lrcList[i].time){
          this.setData({
            // 歌词高亮
            nowLyricIndex:i-1,
            scrollTop: (i - 1) * lyricHeight,
          })
         break
            }
      }
    },
    // 解析歌词
  _parseLyric(sLyric){
    let line = sLyric.split('\n')
    // console.log(line)
    let _lrcList=[]
    line.forEach((elem)=>{
      // match匹配 正则
      let time=elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
      if (time!=null){
        // ["[00:00.206]"]
        // console.log(time)
        // 歌词部分
        let lrc=elem.split(time)[1]
        // console.log(lrc)
        let timeReg=time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
        // 把时间转化成秒
        let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3])/1000
        _lrcList.push({
          lrc,
          time: time2Seconds,

        })
      }
    })

    this.setData({
      lrcList:_lrcList,

    })
  }
  }
})
