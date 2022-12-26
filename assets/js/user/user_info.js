$(function () {
  let form = layui.form
  let layer = layui.layer


  form.verify({
    nickname: function (val) {
      if (val.length > 6) {
        return '昵称长度必须在 1-6 个字符之间'
      }
    }
  })

  initUserInfo()

  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // 发起数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 子页面调用父页面的方法，重新渲染用户头像和用户信息
        // window - fm页面 - 子页面  parent-浏览器页面 - 父页面
        window.parent.getUserInfo()
      }
    })
  })
})