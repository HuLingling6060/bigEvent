$(function () {
  // 从 layui获取 form 表单
  const form = layui.form
  const layer = layui.layer
  // 自己定义验证规则
  form.verify({
    // 密码位数 校验规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 单独给新密码输入框设置校验规则: 不能和原密码相同
    // 校验规则给到谁 value就是 改该input 的值
    samePwd: function (value) {
      // 如果当前的值和oldPwd的值相等 返回
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
    },
    // 单独给确认新密码输入框设置校验规则: 必须和新密码保持一致
    rePwd: function (value) {
      // 如果当前的值和newPwd的值不相等 返回
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致!'
      }
    }
  })


  // 监听 表单 submit 事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // 发起ajax 请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('更新密码失败!')
        }
        layer.msg('更新密码成功!')
        // 重置表单  [0]将jQuery对象转换为原生dom对象 调用reset()重置表单
        $('.layui-form')[0].reset()
      }
    })
  })




})