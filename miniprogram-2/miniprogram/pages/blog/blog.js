// pages/blog/blog.js
// 搜索关键字
let keyword=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow:false,
   
    blogList:[],
  },
  // 点击进入详情页
  goComment(event){
    // console.log(event)
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogid=' + event.target.dataset.blogid,
    })
  },
  // 发布功能
  onpublish(){
    // 判断用户是否授权
  //  当前是否授权用户信息
      wx.getSetting({
        success:(res)=>{
          // console.log(res)
          if (res.authSetting['scope.userInfo']){
            // 获取信息头像等
           wx.getUserInfo({
             success:(res)=>{
              //  console.log(res)
               this.onLoginSuccess({
                 detail:res.userInfo
               })

             }
           })
          }
          else{
            this.setData({
              modalShow: true,
            })
          }
        }
      })

      
  },
  // 获取到授权
  onLoginSuccess(event){
    // console.log(event.detail)
    const detail=event.detail
    //  console.log(res)
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,

    })

  },
  // 未获取到授权
  onLonginFall(){
    wx.showModal({
      title: '授权用户才能发布博客',
      content: '您未授权',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  // 加载博客列表
  _loadBlogList(start=0){
    wx.showLoading({
      title: '拼命加载中',
    })
   wx.cloud.callFunction({
     
     name:'blog',
    //  出的参数
     data:{
       keyword,
       start,
       count:10,//10条
      //  路由
       $url:'list',
       
       
     }
   }).then((res)=>{
    //  console.log(res)
    //  console.log(this.data.blogList)
     this.setData({

       blogList:this.data.blogList.concat(res.result)
     })
   wx.hideLoading()
    //  停止当前页面下拉刷新
   wx.stopPullDownRefresh()
   })
  },
  // 搜索
  onSearch(event){
    // console.log(event.detail.keyword)
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
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
   *  "enablePullDownRefresh": true 配置后才能实现
   * 先清空数据在重新加载数据
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log(e)
    this._loadBlogList(this.data.blogList.length)
 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
      console.log(event)
      let blogObj=event.target.dataset.blog
      return{
        title:blogObj.content,
        path:`/pages/blog-comment/blog-comment?blogid=${blogObj._id}`
        // imageUrl:''
      }
  }
})