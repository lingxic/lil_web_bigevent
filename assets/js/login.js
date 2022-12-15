$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', () => {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从 layui 中获取 form 对象
    let form = layui.form
    let layer = layui.layer  //导入 layer
    // 通过 form.verify() 函数实现自定义校验
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字] [\S]-非空格
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: (value) => {
            // 通过形参拿到的是确认密码框中的内容
            // 获取密码框中的内容
            const pwd = $('.reg-box [name=password]').val()
            // 判断两个密码框中的值是否相等
            if (value !== pwd) {
                return '两次输入的密码不一致，请重新输入！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
        e.preventDefault()
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功！')

            // 登录成功后自动跳转登录界面
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // console.log(res.token)

                // 将登录成功得到的 token 字符串保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 登录成功，跳转后台主页
                location.href = '/index.html'
            }
        })
    })
})
