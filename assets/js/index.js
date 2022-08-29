
$(function () {
  // 调用函数
  getUserInfo()
  //  退出点击事件
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
      // do something
      // 1.清除本地存储的token
      localStorage.removeItem('token')
      // 2.重新跳转到登录页面
      location.href = 'login.html'
      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})


// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    // 不要用写根路径 但要引入 baseApi.js
    url: '/my/userinfo',
    // headers请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败!')
      }
      // 调用 renderAvatar 渲染函数
      renderAvatar(res.data)
    },
    // // 无论成功或失败都会调用 complete 回调
    // complete: function (res) {
    //   // console.log('执行了complete 回调函数');
    //   // console.log(res);
    //   // 在 complete 回调函数中, 可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
    //     // 1.强制清空 token
    //     localStorage.removeItem('token')
    //     // 2.强制跳转到登录页面
    //     location.href = 'login.html'
    //   }
    // }
  })
}


// 封装 渲染用户头像 函数
function renderAvatar(user) {
  // 1.获取用户的基本信息
  // 如果有nickname用, 没有用username
  const name = user.nickname || user.username
  // 2.设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3.按需渲染用户的头像
  if (user.user_pic) {
    // 3.1 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.txet-avatar').hide()
  } else {
    // 3.2 渲染文本头像
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.txet-avatar').html(first).show()
  }
}