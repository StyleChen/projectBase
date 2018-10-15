import apis from '@/apis'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页10条
      totalPage: 100 // 共几条
    }
  },
  activated () {
    let isReset = true
    let isOpendTabs = this.home.isOpendTabs
    isOpendTabs.forEach(item => {
      if (item.path === this.$route.path) {
        isReset = false
      }
    })
    if (isReset) {
      isOpendTabs.push(this.$route)
      this.initData && this.initData()
    }
  },
  computed: {
    ...mapState(['USERTYPE', 'USERNAME', 'ISLEAD', 'USERID', 'DROPDOWNBOX']),
    home () {
      let parent = this.$parent
      while (parent.$options.componentName !== 'home') {
        parent = parent.$parent
      }
      return parent
    },
    apis () {
      return apis
    },
    tableHeight () {
      return document.documentElement.clientHeight - 476
    },
    dialogTableHeight () {
      return document.documentElement.clientHeight - 856
    }
  },
  methods: {
    /**
     * @function 点击查询按钮的时候进行查询
     */
    searchButton () {
      this.currentPage = 1
      this.searchInfo()
    },
    /**
     * @function 点击分页切换页面尺寸的方法
     * @param {Number} pageSize 当前切换后的尺寸
     */
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    /**
     * @function 点击分页切换当前页执行的方法
     * @param {Number} currentPage 切换后的当前页
     */
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    /**
     * @function 转换时间格式
     * @param {String} dateFormat 标准时间
     */
    updateTimeFormat (dateFormat) {
      var date = new Date(dateFormat)
      let month = date.getMonth() + 1
      let day = date.getDate()
      let str = `${date.getFullYear()}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
      return str.toString() === 'NaN-NaN-NaN' ? '' : str
    },
    /**
     * @function 计算两个时间的差别天数
     * @param {String}} startDate 开始时间
     * @param {String} endDate 结束时间
     */
    getTimeDuration (startDate, endDate) {
      let day = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 3600 * 1000)
      return parseInt(day) + 1
    },
    /**
     * @function 判断浏览器版本
     */
    IEVersion () {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        var fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) {
          return 7
        } else if (fIEVersion === 8) {
          return 8
        } else if (fIEVersion === 9) {
          return 9
        } else if (fIEVersion === 10) {
          return 10
        } else {
          return 6 // IE版本<=7
        }
      } else if (isEdge) {
        return 'edge' // edge
      } else if (isIE11) {
        return 11 // IE11
      } else {
        return -1 // 不是ie浏览器
      }
    },
    rowClassName (row, index) {
      if (index % 2 !== 0) {
        return 'table-odd-row'
      } else {
        return 'table-even-row'
      }
    },
    changePage (pageNum) {
      this.currentPage = pageNum
      this.searchInfo()
    },
    changePageSize (pageSizeNum) {
      this.currentPage = 1
      this.page_size = pageSizeNum
      this.searchInfo()
    },
    // 取消table全选
    handleSelectAll (status) {
      this.$refs.table.clearSelection()
    },
    selected (select) {
      this.batchCancelId = []
      select.map((item) => {
        this.batchCancelId.push(item.id)
      })
    },
    changeData () { // 筛选条件改变
      this.tableData = []
      this.batchCancelId = []
      let newObj1 = {}
      for (let i in this.searchForm) {
        newObj1[i] = ''
      }
      this.popupContent = newObj1
    }
  },
  mounted () {
    // this.queryData()
  }
}
