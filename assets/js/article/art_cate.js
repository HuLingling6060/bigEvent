$(function () {

  // 导入 layer
  let layer = layui.layer
  let form = layui.form

  initArtCateList()
  // 获取文章分类列表 
  function initArtCateList() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        // 利用模板引擎渲染
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别 绑定点击事件
  // 定义弹出层的index
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $("#dialog-add").html()
    });
  })

  // 通过代理的形式,为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止默认提交事件
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('新增分类失败!')
        // 重新获取数据 并渲染
        initArtCateList()
        layer.msg('新增分类成功!')
        // 根据 弹出层的index 关闭索引
        layer.close(indexAdd)
      }
    })

  })

  let indexEdit = null
  // 事件委托 为修改按钮 添加点击事件
  $('tbody').on('click', '.btn-edit', function (e) {
    // 弹出修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $("#dialog-edit").html()
    });
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'get',
      url: `/my/article/cates/${id}`,
      success: function (res) {
        // 将 请求回来的 数据 写入 lay-filter属性为'form-edit'的 form表单内
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式,为 form-edit 表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止默认提交事件
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      // 更新的 ajax请求 需要id 从隐藏域 取到了数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('更新分类数据失败!')
        layer.msg('更新分类数据成功!')
        // 根据 弹出层的index 关闭索引
        layer.close(indexEdit)
        // 重新获取数据 并渲染
        initArtCateList()
      }
    })
  })

  // 事件委托 为修改按钮 添加点击事件  根据id 拿到要删除的信息   弹出层 确认是否真的删除   确认后发起ajax请求 删除信息
  $('tbody').on('click', '.btn-delete', function (e) {
    let id = $(this).attr('data-id')
    // 提示 用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      // 当用户点确认 执行这个函数
      //do something
      $.ajax({
        method: 'GET',
        url: `/my/article/deletecate/${id}`,
        success: function (res) {
          if (res.status !== 0) return layer.msg('删除分类失败!')
          layer.msg('删除分类成功!')
          // 删除成功关闭提示
          layer.close(index);
          // 刷新列表数据
          // 重新获取数据 并渲染
          initArtCateList()
        }
      })
    })
  })








})
