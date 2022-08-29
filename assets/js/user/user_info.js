$(function () {
  // 从 layui获取 form 表单
  const form = layui.form
  const layer = layui.layer
  // 自己定义验证规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间!'
      }
    }
  })
  // 调用函数
  initUserInfo()
  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'get',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('获取用户信息失败!')
        }
        // console.log(res);
        // 调用 form.val()快速为表单赋值
        // 将 res.data 的值赋值给lay-filter值为formUserInfo的表单
        form.val('formUserInfo', res.data)
      }
    })
  }


  // 重置表单的数组
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    // 重新调取用户信息,提交表单
    initUserInfo()
  })


  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功')
        // 在子页面iframe  调用 父页面的方法重新渲染 '欢迎***'
        window.parent.getUserInfo()
        // window 子页面在的窗口 
        // window.parent 父页面 index.html
      }
    })
  })


})