// components/blog-card/blog-card.js
import formatTime from '../../utlis/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object,
    
  },
  // 监听
  observers:{
    
    ['blog.createTime'](val){
    
     if(val){
       this.setData({
         _createTime: formatTime(new Date(val))
       })
       
       
     }
    }
    
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime:'',
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event){
      const ds=event.target.dataset
      // 预览图片
      wx.previewImage({
        // 需要预览的图片链接列表
        urls: ds.imgs,
        // 当前显示图片的链接
        current:ds.imgSrc
      })
    }
  }
})
