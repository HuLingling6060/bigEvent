$(function () {
  const layer = layui.layer


  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    // 在点击时 用js 模拟点击 图片选择框
    $('#file').click()
  })

  // 给 文件选择框 添加change事件
  $('#file').on('change', function (e) {
    // console.log(e);
    // 获取用户选择的文件
    const filelist = e.target.files
    console.log(filelist);
    if (!filelist.length) {
      return layer.msg('请选择图片!')
    }

    // 1.拿到用户选择的文件
    const file = e.target.files[0]
    // 2.根据选择的文件，创建一个对应的 URL 地址 createObjectURL方法将 图片转化为路径
    const newImgURL = URL.createObjectURL(file)
    console.log(newImgURL);
    // 3.先 销毁 旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  $('#btnUpload').on('click', function () {
    // 1.拿到用户裁剪之后的头像
    const dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2.调用接口，将图片传入服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败!')
        }
        layer.msg('更换头像成功!')
        // 调用 父页面getUserInfo()函数 重新拿数据渲染
        window.parent.getUserInfo()
      }
    })


  })










})