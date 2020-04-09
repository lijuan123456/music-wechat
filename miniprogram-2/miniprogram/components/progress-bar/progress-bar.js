//  进度条宽度
let movableAreaWidth = 0
let movableViewWidth = 0
// 音频播放管理
const bacgroundAudioManager = wx.getBackgroundAudioManager()
// 当前描述
let currentSec=-1
// 当前歌曲中时长，一秒为单位的
let duration=0
// 当前的进度条是否在拖拽，解决当进度条拖动时与updatetime事件有冲突问题
let isMoving=false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    progress: 0,
  },
  lifetimes: {
   
    // 生命周期函数组件布局完成后加载
    ready() {
      //重新返回时重新获取总时间
      if (this.properties.isSame && this.data.showTime.totalTime=='00:00') {
      this._setTime()
      }
      this._getMovablrDis()
      this._bindBGMEvent() 
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 拖动时获取当前位置
    onChange(event){
      // console.log(event)
      // 拖动
      if (event.detail.source=="touch"){
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth)*100
        this.data.movableDis=event.detail.x
        isMoving=true
      }
    },
    onTouchEnd(){
      const currentTimeFmt=this._dateFormat(Math.floor(bacgroundAudioManager.currentTime)) 
      this.setData({
        progress: this.data.progress ,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      
      // 把当前歌曲进度设置到什么位置
      bacgroundAudioManager.seek(duration *this.data.progress/100)
      isMoving=false
    },

    //  进度条
    _getMovablrDis() {
      // 获取宽度
      const query = this.createSelectorQuery()
      // 宽度
      query.select('.movable-area ').boundingClientRect()
      query.select('.movable-view ').boundingClientRect()
      // 执行所有请求形成数组
      query.exec((rect) => {
       
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
       
      })
    },

    _bindBGMEvent() {
      // 播放
      bacgroundAudioManager.onPlay(() => {
        // console.log('onPlay')
        // 坑反复移动是偶尔会触发onTouchEnd完成后再触发一次onChange
        isMoving=false
        // 控制器点击时先外抛出一个事件
         this.triggerEvent('musicPlay')
      }),
        // 停止
        bacgroundAudioManager.onStop(() => {
          // console.log('onStop')
        }),
        // 暂停
        bacgroundAudioManager.onPause(() => {
          // console.log('onPause')
          this.triggerEvent('musicPause')
        }),
        // 正在加载中
        bacgroundAudioManager.onWaiting(() => {
          // console.log('onWaiting')
        }),
        // 能够播放
        bacgroundAudioManager.onCanplay(() => {
          // console.log('onCanplay')
        // console.log(bacgroundAudioManager.duration)
        // 这里是一个概率问题不是所有机型都会这样间隔判断获取当前播放时长
        if (typeof bacgroundAudioManager.duration!='undefined'){
           this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
        
        }),
        // 播放进度
        bacgroundAudioManager.onTimeUpdate(() => {
          // console.log('onTimeUpdate')
          if(!isMoving){
        
          // 当前已经播放时间
        const currentTime= bacgroundAudioManager.currentTime
            // console.log(currentTime)
        // 歌曲总时长
        const duration = bacgroundAudioManager.duration
        const sec = currentTime.toString().split('.')[0]
        
        // 优化currentTime 每一秒一次
        if (sec != currentSec){
         
          // 格式化时间
          const currentTimeFmt = this._dateFormat(currentTime)
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            // 进度条颜色
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
          })
          currentSec = sec 
         
        
          // 联动歌词 组件之间传递自定义事件传出currentTime
          this.triggerEvent('timeUpdate',{
           
            currentTime

          })

        }
          }
        }),
        // 结束
        bacgroundAudioManager.onEnded(() => {
        // console.log('onEnded')
        // 组件向外抛出/激活事件
        this.triggerEvent('musicEnd')
        })
        // 出现错误
      bacgroundAudioManager.onError((res) => {
        // console.log(res.errMsg)
        // console.log(res.errCond)
        wx.showToast({
          title: '错误' + res.errCond,
        })
      })

    },
    // 时间戳
    _setTime(){
       duration=bacgroundAudioManager.duration
      // console.log(duration)
      const durationFmt = this._dateFormat(duration)
      // console.log(durationFmt)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
      
    },
    // 格式化时间
    _dateFormat(sec){
      // 分
     const min=Math.floor(sec/60)
    //  秒
      sec = Math.floor(sec % 60) 
      return {
        'min': this._parse0(min),
        "sec": this._parse0(sec) 
             }
    },
    // 补零
    _parse0(sec){
     return sec<10?'0'+sec:sec
    }
  }
})