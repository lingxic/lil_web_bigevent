$(function () {
  let layer = layui.layer
  let form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        let htmlStr = template('tpl-table', res)
        // 将数据渲染给表格
        $('tbody').html(htmlStr)
      }
    })
  }

  // 添加类别弹出层
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '245px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 关闭弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理为 btn-edit 绑定点击事件
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '245px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    // console.log(id)
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res)
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过代理为 btn-delete 绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败！')
          }
          layer.msg('删除文章分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})