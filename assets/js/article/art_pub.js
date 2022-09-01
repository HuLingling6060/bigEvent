$(function () {
  let layer = layui.layer
  let form = layui.form
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 定义 加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取分类失败')
        // 使用模板引擎渲染分类的可选项
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知 layui 重新渲染表单区域的 UI结构
        form.render()
      }
    })

  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 为选择封面的按钮.绑点点击事件 触发file选择框
  $('#btnChooseImage').on('click', function () {
    // 模拟点击行为
    $('#coverFile').click()
  })
  // 监听 coverFile 的 change事件, 获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    const files = e.target.files
    // 如果用户没有选择文件  return 出去
    if (!files.length) {
      return layer.msg('请选择图片!')
    }
    // 根据选择的文件，创建一个对应的 URL 地址
    const newImgURL = URL.createObjectURL(files[0])
    // 先 销毁 旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义一个变量 接收文件的发布状态
  let art_state = '已发布'  // 默认为已发布

  // 为存为草稿按钮,绑定事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    // 1.阻止表单的默认提交行为
    e.preventDefault()
    // 2.基于 form 表单,快速创建一个 FormData 对象
    const fd = new FormData($(this)[0])
    //3.将文章的发布状态 追加到 fd
    fd.append('state', art_state)

    // fd.forEach(function (v, k) {
    //   console.log(k, v);  //  form表单的键值对
    // })
    // 4.将封面裁剪过后的图片,输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象 存储到 fd 中
        fd.append('cover_img', blob)
        // 6.发起 ajax 请求 发布文章
        publishArticle(fd)
      })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layer.msg('发布文章失败！')
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转带文章列表页面
        location.href = 'art_list.html'
      }
    })
  }
})