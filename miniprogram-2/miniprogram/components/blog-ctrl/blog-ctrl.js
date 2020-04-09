// components/blog-ctrl/blog-ctrl.js
let userInfo={}
const db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 博客穿过来的ID
    blogId:String,
    blog:Object,
  },
  // 接收图标
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
   
    
   

  
  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示登录授权
    loginShow:false,
    // 底部弹出层是否弹出
    modalShow:false,
    content:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      // 判断是否授权
      wx.getSetting({
        success:(res)=>{
          // 获取授权信息
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success:(res)=>{
                userInfo=res.userInfo
                // 显示评论的弹出层
                this.setData({
                  modalShow:true,
                })
              }
            })
          }else{
            // 没有授权显示授权弹出
            this.setData({
              loginShow: true
            })
            
          }
        }
      })
    },
    // 授权成功
    onLoginsuccess(event){
      userInfo:event.detail
        // 授权框消失评论框弹出
        this.setData({
          loginShow:false,
        },()=>{
          this.setData({
            modalShow: true
          })
        })
    },
    // 授权失败
    onLoginfall(){
       wx.showModal({
         title: '授权用户才能评价',
         content: '',
        
        
       })
    },
    // // 输入内容
    // onInput(event){
    //   this.setData({
    //     content:event.detail.value
    //   })
      
    // },
    onSend(event){
      console.log(event)
      let formId = event.detail.formId
    //  把评论信息插入云数据库
      // console.log(event.detail.value.content)
      
       let content = event.detail.value.content
      
       
     
    if(content.trim()==""){
         wx.showModal({
           title: '评论内容不能为空',
           content: '',
         })
         return
    }
    // 获取品论人信息 时间 
    wx.showLoading({
      title: '评价中',
      // 品论是不希望用户进行其他操作
      mask:true,
    })
    // 插入数据库
    db.collection('blog-comment').add({
      data:{
        content,
        createTime:db.serverDate(),
        blogId: this.properties.blogId,
        nickName:userInfo.nickName,
        avatarUrl:userInfo.avatarUrl,

      }
    }).then((res)=>{
      // 推行对应得模板消息 调用云函数
      // wx.cloud.callFunction({
      //   name:'sendMessage',
      //   data:{
      //     content,
      //     formId,
      //     blogId:this.properties.blogId

      //   }
      // }).then((res)=>{
      //   console.log(res)
      // })

      wx.hideLoading()
      wx.showToast({
        title: '评论成功',
      })
      this.setData({
        modalShow: false,
        content:"",
      })
    })

// 刷新父元素评论页面
this.triggerEvent('refreshCommentList')
    
      
    },
  }
})
