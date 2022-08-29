// 注意:每次调用 $.get()或$.post()或$.ajax()
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  options.url = 'http://big-event-api-t.itheima.net' + options.url

  // 统一为有权限的接口, 设置 headers 请求头
  // 链接包含 'my' 设置请求头  否则不需要设置
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局统一配置
  // 无论成功或失败都会调用 complete 回调
  options.complete = function (res) {
    // console.log('执行了complete 回调函数');
    // console.log(res);
    // 在 complete 回调函数中, 可以使用 res.responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1.强制清空 token
      localStorage.removeItem('token')
      // 2.强制跳转到登录页面
      location.href = 'login.html'
    }
  }
})