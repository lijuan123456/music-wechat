// 文字最大值
const MAX_WORDS_NUM = 140
// 图片最大个数
const MAX_IMG_NUM = 9
// 初始换
const db = wx.cloud.database()
// 输入的文字内容
let content = ''
// 用户信息
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,//添加那个图片的加号是否显示

  },
  // 输入框
  onInput(event) {
    // console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大数字为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum: wordsNum
    })
    // 输入的值存进content
    content = event.detail.value
  },
  // 获取焦点弹出键盘
  onFous(event) {
    // 在模拟器上测试键盘高度为0，可在真机测试
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height
    })

  },
  // 失去焦点
  onBlur() {
    this.setData({
      footerBottom: 0
    })

  },
  // 点击图片
  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    // 从本地相册选择图片或使用相机拍照
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  // 删除图片
  onDelImg(event) {
    // splice 删除袁术组第index个删除1个这时
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    // 删除完图片末尾要显示加号
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })

    }
  },
  // 预览图片
  onPreviewImage(event) {

    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },
  // 发送
  send() {
    // 数据=》云数据
    // 图片=》云存储  fileID openID 昵称 头像 时间


    // 输入框文字内容不能为空 去掉空额
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    // 出现一个蒙版mask:true,把地下内容这招住
    wx.showLoading({
      title: '发布中',
      mask:true,
    })
    let promiseAll = []
    let fileIds = []
    // 图片上传 将本地资源上传至云存储空间
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        //  exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。此数组的第 0 个元素是与正则表达式相匹配的文
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: item,
          success: (res) => {
            // console.log(res)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            // console.log(err)

            reject()
          }
        })
      })
      promiseAll.push(p)
    }
    //  存入到云数据库
    Promise.all(promiseAll).then((res) => {
      // 取到数据集合
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(),//取到的是服务端的时间

        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        // 发送成功后返回blog，并刷新出去 在子调用父界面的下拉刷新
          wx.navigateBack()
        // 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
          const pages=getCurrentPages()
          // 取到上个界面
          const prevPage=pages[pages.length-2]
        // 用上一个界面上的onPullDownRefresh方法来完成刷新列表的功能
        prevPage.onPullDownRefresh()

          // console.log(pages)
            
          

      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发送失败',
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    userInfo = options
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})