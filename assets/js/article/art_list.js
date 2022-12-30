$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())

    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补0的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询参数对象，
  // 请求数据时，需要将请求参数对象提交到服务器
  let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类id
    state: ''  // 文章的发布状态
  }

  initTable()
  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 获取列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表数据失败！')
        }
        // 使用模板引擎渲染页面数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        // 使用 form.render 方法重新渲染表单区域的 UI 结构
        form.render()
      }
    })
  }

  //为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()

    // 获取表单中选中项的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()

    // 查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件重新渲染表格数据
    initTable()
  })

  // 分页
  function renderPage(total) {
    // console.log(total)
    // 调用 laypage.render() 方法渲染分页结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 数据总条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 切换分页的回调函数
      // 触发 jump 回调的方式有两种：
      // 1.点击页码时会触发回调
      // 2.只要调用了laypage.render()方法就会触发回调
      jump: function (obj, first) {
        // console.log(first)  // 是否首次
        //obj包含了当前分页的所有参数
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagenum = obj.curr  // 将最新页码值赋值给查询参数q
        // 把最新的条目数赋值到查询参数 q 对象的 pagesize 属性中
        q.pagesize = obj.limit
        // 可以通过 first 的值来判断是通过哪种方式触发的 jump 回调
        // 如果 first 的值为 true, 证明是方式2触发的，否则是方式1
        if (!first) {
          // 根据最新的 q 获取对应的数据列表，并渲染表格
          initTable()
        }
      }
    })
  }

  // 删除文章数据
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    let len = $('.btn-delete').length
    // 获取到文章的 id
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中是否还有剩余数据
          // 如果没有剩余数据，则让页码-1之后再调用 initTable()
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    })
  })


  // // 通过代理为 btn-edit 绑定点击事件
  // let indexEdit = null
  // $('tbody').on('click', '.btn-edit', function () {
  //   indexEdit = layer.open({
  //     type: 1,
  //     area: ['1050px', '600px'],
  //     title: '编辑文章',
  //     content: $('#dialog-edit').html()
  //   })
  //   let id = $(this).attr('data-id')
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/article/' + id,
  //     success: function (res) {
  //       form.val('form-edit', res.data)
  //       console.log(res);
  //     }
  //   })
  // })
  $('tbody').on('click', '.btnEditArticle', function (e) {
    var id = $(this).attr('data-id')
    location.href = `/article/art_pub.html?id=${id}`
  })

})