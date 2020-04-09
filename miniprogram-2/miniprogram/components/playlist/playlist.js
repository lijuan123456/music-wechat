// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object,
    }
  },
  // 监听器 点击量
  observers: {
    ['playlist.playCount'] (count){
    //  console.log(count)
      
      this.setData({
        _count:this._tranNumber(count, 2)
      })
   }


  },
  /**
   * 组件的初始数据
   */
  data: {
 _count:0
  },

  /**
   * 组件的方法列表
   * _tranNumber私有属性
   */
  methods: {
    // 点击事件
    goToMusiclist(){
      // 跳转到详情页
     wx.navigateTo({
      //  es6 拼接路径不用+号
       url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`
       
     })
    },
    _tranNumber(num,point){
      // 取小数点以前
      let numStr=num.toString().split('.')[0];
      // console.log(numStr)1574200
     
      // // 【按摩店面数据长度
      if (numStr.length<6){
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8){
        let decimal = numStr.substring(numStr.length - 4, numStr.length-4+point)
        // console.log(decimal)  //42
    return parseInt(num / 10000) + '.' + decimal+'万'
        // console.log(a)//  157.42
      } else if (numStr.length > 8){
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8+point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal)+'亿'
      }
    }
  }
})