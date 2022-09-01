$(function () {
  let layer = layui.layer
  let form = layui.form
  // 将 pageBox初始化为分页区
  let laypage = layui.laypage;


  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    return dt.toLocaleString().replaceAll('/', '-')
  }


  // 定义一个查询的参数对象, 将来请求数据的时候,
  // 需要将请求参数对象提交到服务器
  let q = {
    pagenum: 1, // 页码值,默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据,默认每页显示2条
    cate_id: '', // 文章分类的 Id 
    state: ''  // 文章的发布状态
  }

  initTable()
  initCate()


  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取文章列表失败')

        // 使用模板引擎渲染页面的数据
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
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

  // 为 form-search 绑定 submit 提交事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取 表单中 选中的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()

    // 为查询 参数对象q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state

    // 根据最新的筛选条件 重新渲染表格数据
    initTable()
  })

  // 定义 渲染 分页的方法
  // 表格分页是为 列表服务的, 所以在渲染表格之后渲染分页
  // 页码值: 总条数/每页数  向上取值
  function renderPage(total) {
    // 调用 laypage.render()方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  // 分页器的容器 注意，这里的 pageBox 是 ID，不用加 # 号
      count: total,//数据总数，从服务端得到
      limit: q.pagesize, // 每页显示的条数
      curr: q.pagenum,  // 默认起始页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],

      // 分页发生切换的时候,触发 jump 回调
      // 触发 jump 回调的两种方式:
      // 1.点击页码的时候,触发 jump 回调
      // 2.只要调用了 laypage.render()方法  触发 jump 回调
      jump: function (obj, first) {
        // console.log(first);  // 第一种方法得到的是undefined   第二种方法得到的是 true
        // console.log(obj.curr);
        // 把最新的页码值赋值到q这个查询对象中
        q.pagenum = obj.curr
        // 把最新的条目数 赋值到 q上
        q.pagesize = obj.limit
        // 根据最新的q获取对应的数据列表, 并渲染表格
        // initTable()  // 直接调用会发生死循环
        if (!first) {
          // 说明是通过第一种方法 调用的jump回调函数 可以调用initTable() 
          initTable()
        }
      }
    })
  }

  // 通过代理的形式,为删除按钮绑定点击事件处理
  $('tbody').on('click', '.btn-delete', function (e) {
    // 在点击时,拿到页面上所有删除按钮的个数
    // 再判断 点击之后 还有没有删除按钮 是否需要页码-1
    let len = $('.btn-delete').length
    console.log(len);
    // 获取到文章的id
    const id = $(this).attr('data-id')
    // 询问用户 是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: `/my/article/delete/${id}`,
        success: function (res) {
          if (res.status !== 0) return layer.msg('删除文章失败!')
          layer.msg('删除文章成功!')
          // 当数据删除完成后 需要判断这一页中是否还有剩余数据
          // 如果没有数据了,则让页码值-1 之后
          // 再重新调用 initTable()方法 重新渲染  
          if (len === 1) {
            // 如果 len 的值等于1 说明删除完毕之后 页面上 就没有值了 
            // 需要页码减一
            // 页面值 最小必须是1  所以需要判断页码值是不是等于1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

          }
          initTable()
        }
      })

      layer.close(index);
    });
  })


})