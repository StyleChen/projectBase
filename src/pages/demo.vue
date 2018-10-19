<template>
  <div>
    <!-- <keep-alive><router-view></router-view></keep-alive> -->
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-form-item label="账号" class="popup_FormItem" style="width: 200px">
            <el-input name="user_name" @change="changeData" v-model="searchForm.user_name" class="search_Input"/>
          </el-form-item>
          <el-form-item label="姓名" class="popup_FormItem" style="width: 200px">
            <el-input name="name" @change="changeData" v-model="searchForm.name" class="search_Input"/>
          </el-form-item>
          <el-form-item label="状态" class="popup_FormItem">
            <el-select clearable v-model="searchForm.enabled" @change="changeData" placeholder="" class="search_select">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in DROPDOWNBOX.enabled" :key="item.code" :value="item.code">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-button @click="queryClose=true">高级查询</el-button>
          <el-button @click="selectTableHeaderVisible=true">选择表头</el-button>
          <search-button text="查 询" :clickfunc='searchButton'></search-button>
        </el-row>
      </el-form>
    </div>
    <div class="tableBackgroundDiv">
      <el-table
      :data="tableData"
      :height="tableHeight"
      :header-cell-style="{background: '#FFF', color: '#111111'}"
      :row-class-name="rowClassName"
      border
      ref="table"
      size="mini"
      style="width: 100%"
      @selection-change="selected">
        <el-table-column
          type="index"
          fixed="left"
          label="序号"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="item in selectedHeader"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :header-align="item.headerAlign"
          :align="item.align"
          :width="item.width"
          :min-width="item.minWidth">
        </el-table-column>
        <!-- <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="recommend_unit"
          header-align="center"
          align="center"
          label="推荐单位"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="enabled"
          header-align="center"
          align="center"
          label="状态"
          width="180">
        </el-table-column> -->
      </el-table>
    </div>
    <div class="button_container">
      <default-button text="增 加" :clickfunc='addButton'></default-button>
      <default-button text="修 改" :clickfunc='modifyButton'></default-button>
    </div>
    <div class="page_container">
      <!-- <Page size="small" class="floatLeft" ref="pages" :current="currentPage" :total='totalPage' show-total class-name="pageClass" show-elevator show-sizer :pageSize="page_size" placement="top" @change="changePage" @on-page-size-change="changePageSize"></Page> -->
      <el-pagination
      small
      @size-change="changePageSize"
      @current-change="changePage"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      class="floatLeft"
      ref="pages"></el-pagination>
    </div>
    <el-dialog :visible.sync="popupDisplay" :styles="popupStyle" :mask-closable="false" :closable="false" :loading="loading">
      <div class="popup_body">
        <el-form ref="popupContent" :model="popupContent" :rules="popupContentRules" label-width="80px">
          <el-row>
            <el-col span="24">
              <el-row>
                <el-col :sm="12" :md="8" :lg="12">
                  <el-form-item label="账号" prop="user_name" class="popupContent_FormItem">
                    <el-input v-model="popupContent.user_name" class="popup_Input"/>
                  </el-form-item>
                </el-col>
                <el-col v-if="!edit" :sm="12" :md="8" :lg="12">
                  <el-form-item label="密码" prop="password" class="popupContent_FormItem">
                    <el-input v-model="popupContent.password" class="popup_Input"/>
                  </el-form-item>
                </el-col>
                <el-col v-if="edit" :sm="12" :md="8" :lg="12">
                  <el-form-item label="密码" prop="" class="popupContent_FormItem">
                    <default-button text="重置密码" :clickfunc='resetPassword'></default-button>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8" :lg="12">
                  <el-form-item label="姓名" prop="name" class="popupContent_FormItem">
                    <el-input v-model="popupContent.name" class="popup_Input"/>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8" :lg="12">
                  <el-form-item label="用户类型" class="popupContent_FormItem">
                    <el-select clearable v-model="popupContent.user_type" @change="userTypeOnChange" :label-in-value="true" placeholder="" class="popup_select">
                      <el-option value="">请选择</el-option>
                      <el-option v-for="item in DROPDOWNBOX.user_type" :key="item.code" :value="item.code">{{item.label}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8" :lg="12">
                  <el-form-item label="状态" prop="enabled" class="popupContent_FormItem">
                    <el-select clearable v-model="popupContent.enabled" placeholder="" class="popup_select">
                      <el-option value="">请选择</el-option>
                      <el-option v-for="item in DROPDOWNBOX.enabled" :key="item.code" :value="item.code">{{item.label}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8" :lg="12">
                  <el-form-item v-if="unitDisplay || reportDisplay" label="推荐单位" class="popupContent_FormItem">
                    <el-select clearable v-model="popupContent.reco_unit" placeholder="" class="popup_select">
                      <el-option value="">请选择</el-option>
                      <el-option v-if="unitDisplay" v-for="item in DROPDOWNBOX.recommend_unit" :key="item.code" :value="item.code">{{item.label}}</el-option>
                      <el-option v-if="reportDisplay" v-for="item in DROPDOWNBOX.report_unit" :key="item.code" :value="item.code">{{item.label}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="leaderDisplay" label="负责项目" class="popupContent_FormItem">
                    <el-select clearable v-model="popupContent.sport_project" placeholder="" class="popup_select">
                      <el-option value="">请选择</el-option>
                      <el-option v-for="item in DROPDOWNBOX.sport_project" :key="item.code" :value="item.code">{{item.label}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <div class="user-mana-transfer">
                  <el-form-item label="分配权限" class="popupContent_FormItem">
                    <el-transfer :data ="transferData" v-model="transferTargetKeys" @change="transferHandleChange"></el-transfer>
                  </el-form-item>
                </div>
             </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <default-button text="确定" :clickfunc='confirmSubmit'></default-button>
        <default-button text="取消" :clickfunc='cancelSubmit'></default-button>
        <!-- <Button type="text" size="small" @click="confirmSubmit">确定</Button>
        <Button type="text" size="small" @click="cancelSubmit">取消</Button> -->
      </div>
    </el-dialog>
    <query-more-modal :queryClose.sync="queryClose" :searchForm.sync="searchForm"></query-more-modal>
    <select-table-header :selectTableHeaderVisible.sync="selectTableHeaderVisible" :selectedHeader.sync="selectedHeader"></select-table-header>
  </div>
</template>
<script>
import apis from '@/apis'
import { mapState, mapMutations } from 'vuex'
import defaultButton from '@/components/defaultButton'
import searchButton from '@/components/searchButton'
import queryMoreModal from '@/components/queryMoreModal'
import selectTableHeader from '@/components/selectTableHeader'
import mixin from '@/mixin'
export default {
  components: { defaultButton, searchButton, queryMoreModal, selectTableHeader },
  mixins: [mixin],
  data () {
    return {
      queryClose: false, // 高级查询
      selectTableHeaderVisible: false, // 选择表头
      currentPage: 1, // 当前页
      page_size: 10, // 每页10条
      totalPage: 1, // 共几条
      leftRadio: '',
      radioData: [],
      batchCancelId: [],
      transferData: [],
      transferTargetKeys: [],
      unitDisplay: false, // 推荐单位显示
      reportDisplay: false, // 上报协会显示
      leaderDisplay: false, // 负责项目显示
      popupDisplay: false,
      loading: true,
      edit: false,
      popupStyle: { // 弹窗宽度设置
        width: '790px'
      },
      searchForm: {
        user_name: '',
        name: '',
        enabled: '',
        reco_unit: ''
      },
      popupContent: {
        user_name: '',
        name: '',
        password: '',
        enabled: '',
        reco_unit: '',
        user_type: '',
        sys_role_id: '',
        sport_project: ''
      },
      selectedHeader: [
        {
          prop: 'user_name',
          label: '账号',
          hoverClass: 'el-icon-close',
          headerAlign: 'center',
          align: 'center',
          width: '180'
        },
        {
          prop: 'name',
          label: '姓名',
          hoverClass: 'el-icon-close',
          headerAlign: 'center',
          align: 'center',
          width: '180'
        },
        {
          prop: 'recommend_unit',
          label: '推荐单位',
          hoverClass: 'el-icon-close',
          headerAlign: 'center',
          align: 'center',
          width: '180'
        },
        {
          prop: 'enabled',
          label: '状态',
          hoverClass: 'el-icon-close',
          headerAlign: 'center',
          align: 'center',
          minWidth: '180'
        }
      ],
      tableData: [],
      popupContentRules: {
        user_name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
        // allotAutho: [{ required: true, message: '请分配权限', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState(['USERNAME', 'USERTYPE', 'DROPDOWNBOX']),
    tableHeight () {
      return document.documentElement.clientHeight - 434 + 127
    }
  },
  methods: {
    ...mapMutations(['setUserName', 'setUserType', 'setName', 'setUserId']),
    getTransferData () { // 穿梭框取值
      let transferData = []
      this.$http.post(apis.UserRoleSearch).then((res) => {
        if ((res.data.status).toString() === '1') {
          let data = res.data.data
          data.role_name.map((item) => {
            transferData.push({
              key: item.code,
              label: item.label
            })
          })
          this.td = this.transferData = transferData
        }
      })
    },
    searchInfo () {
      let searchForm = this.searchForm
      searchForm.pageSize = this.page_size
      searchForm.currentPage = this.currentPage
      this.$http.post(apis.UserSearch, searchForm).then((res) => {
        if ((res.data.status).toString() === '1') {
          let data = res.data.data
          this.tableData = data.records
          this.totalPage = parseInt(data.totalRecord)
        }
      })
    },
    addButton () {
      this.getTransferData()
      this.popupDisplay = true
      this.edit = false
    },
    modifyButton () {
      if (this.batchCancelId.length !== 1) {
        this.$Message.error('有且只能选择一条数据')
        return false
      } else {
        this.popupDisplay = true
        this.edit = true
        // this.getTransferData()
        let transferTargetKeys = []
        let transferData = []
        this.$http.post(apis.UserEditShow, {user_id: this.batchCancelId.join()}).then((res) => {
          if ((res.data.status).toString() === '1') {
            let data = res.data.data
            this.popupContent.user_name = data.user_name
            this.popupContent.user_type = data.user_type
            this.popupContent.enabled = data.enabled
            this.popupContent.name = data.name
            this.popupContent.reco_unit = data.reco_unit
            this.popupContent.sport_project = data.sport_project
            data.transferData.map((item) => {
              transferData.push({
                key: item.role_id,
                label: item.role_name
              })
            })
            data.transferTargetKeys.map((item) => {
              transferTargetKeys.push(item.role_id)
            })
            this.td = this.transferData = transferData
            this.tr = this.transferTargetKeys = transferTargetKeys
          }
        })
      }
    },
    resetPassword () {
      this.$http.post(apis.UserResetPwd, {user_id: this.batchCancelId.join()}).then((res) => {
        if ((res.data.status).toString() === '1') {
          // this.$Message.success(res.data.msg)
        }
      })
    },
    confirmSubmit () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
      this.$refs.popupContent.validate((valid) => {
        if (valid) {
          let apisUrl = this.edit ? apis.UserEdit : apis.UserAdd
          let formData = this.popupContent
          formData.sys_role_id = this.transferTargetKeys
          formData.user_id = this.batchCancelId.join()
          this.$http.post(apisUrl, formData).then((res) => {
            if ((res.data.status).toString() === '1') {
              this.popupDisplay = false
              this.popupContent = {}
              this.transferTargetKeys = []
              this.$refs.popupContent.resetFields()
              this.handleSelectAll()
              this.searchInfo()
            }
          })
        }
      })
    },
    cancelSubmit () {
      this.handleSelectAll()
      this.$refs.popupContent.resetFields()
      this.transferTargetKeys = []
      this.popupContent = {}
      this.popupDisplay = false
    },
    transferHandleChange (newTargetKeys) {
      this.tr = this.transferTargetKeys = newTargetKeys
    },
    leftRadioChange (value) {
      let arr = this.td
      arr = arr.filter((item) => {
        return item.type === value
      })
      this.transferData = arr
    },
    userTypeOnChange (val) {
      val.label === '推荐单位' ? this.unitDisplay = true : this.unitDisplay = false
      val.label === '领队' ? this.leaderDisplay = true : this.leaderDisplay = false
      val.label === '上报协会' ? this.reportDisplay = true : this.reportDisplay = false
    }
  }
}
</script>
<style scoped>
.popup_FormItem {
  float: left;
  margin: 0;
}
.search_select {
  width: 120px;
}
.top {
  margin-bottom: 17px;
}
.popupContent_FormItem {
  float: left;
}
.popup_select,
.popup_Input {
  width: 240px;
}
.radio_button_container {
  padding: 0 55px;
  width: 100%;
  text-align: left;
}
</style>
<style>
.user-mana-transfer .ivu-transfer {
  top: 40px;
  left: -80px;
  width: calc(100% + 80px);
}
</style>
