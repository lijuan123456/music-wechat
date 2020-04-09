//app.js
App({
  onLaunch: function (option) {
    console.log("onLaunch")
    console.log(option)
    this.checkUpdata()
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-lhq1m',
        traceUser: true,
      })
    }
    this.getOpenId()
// 全局属性
    this.globalData = {
      palyingMusicId:-1,
      openid:-1,
    }
  },
  // 监听小程序启动和前台
  onShow(option){
    console.log(" onShow")
    console.log(option)
  },
  // 设置当前全局属性
  setPlayingMusicId(musicId){
    this.globalData.palyingMusicId = musicId
  },
  // 获取当前全局属性
  getPlayingMusicId(){
    return this.globalData.palyingMusicId
  } ,
// 歌曲记录获取openID
  getOpenId(){
   wx.cloud.callFunction({
     name:'login'
   }).then((res)=>{
     const openid = res.result.openid
    //  console.log(res)
     this.globalData.openid = openid
     if (wx.getStorageSync(openid)==''){
       wx.setStorageSync(openid, [])
     }
    
   })
  },
  // 版本更新
  checkUpdata(){
    // 更新管理器
   const updataManager= wx.getUpdateManager()
  //  检测版本更新
    updataManager.onCheckForUpdate((res)=>{
      if(res.hasUpdate){
        updataManager.onUpdateReady(()=>{
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否需要重启应用',
            success(res){
              // 点击确定
              if(res.confirm){
                updataManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }
})

