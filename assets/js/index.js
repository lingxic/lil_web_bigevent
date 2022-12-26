$(function () {
  // 调用 getUserInfo() 获取用户的基本信息
  getUserInfo()

  let layer = layui.layer
  // 绑定点击事件
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 清空本地存储的 token 
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = '/login.html'
      // 关闭询问框
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用 renderAvatar() 获取用户头像
      renderAvatar(res.data)
    },
    // // 无论成功失败都会调用 complete
    // complete: function (res) {
    //   // 在 complete 回调函数中，使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 强制清空 token 
    //     localStorage.removeItem('token')
    //     // 强制跳转到登录页面
    //     location.href = '/login.html'
    //   }
    // }
  })
}
function renderAvatar(user) {
  // 获取用户的名称
  let name = user.nickname || user.username
  // 设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}