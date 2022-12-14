$(function () {
  // 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1, // 正方形 - 裁剪框的形状
    // aspectRatio: 5 / 3, // 长方形
    // 指定预览区域
    preview: '.img-preview'
  }

  // 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()  // 模拟点击上传文件按钮
  })

  // 为文件选择框绑定 change 事件
  $('#file').on('change', function (e) {
    // console.log(e)
    // 获取用户选择的文件
    let fileList = e.target.files
    // console.log(fileList)
    if (fileList.length === 0) {
      return layui.layer.msg('请选择头像')
    }

    // 拿到用户选择的文件
    let file = e.target.files[0]
    // 将文件转化为路径
    let newImgURL = URL.createObjectURL(file)
    // 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 为确定按钮绑定点击事件
  $('#btnUpload').on('click', function (e) {
    // 拿到用户裁剪之后的图像
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image.png')  // 将 Canvas 画布画布上的内容转化为 base64 格式的字符串

    // 调用接口，把头像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更换头像失败！')
        }
        layui.layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      }
    })
  })
})