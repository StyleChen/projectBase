<template>
  <div>
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-form-item :label="$t('JSMC')" class="popup_FormItem" style="width: 300px">
            <el-input size="mini" name="name" @change="changeData" v-model="searchForm.name" class="search_Input"/>
          </el-form-item>
          <search-button :text="$t('CX')" class-name="user_action_btn" :clickfunc='searchButton'></search-button>
        </el-row>
      </el-form>
    </div>
    <div class="tableBackgroundDiv">
      <el-table
      :data="tableData"
      :height="tableHeight"
      :header-cell-style="{background: '#DDD', color: '#111111'}"
      :row-class-name="rowClassName"
      border
      ref="table"
      size="mini"
      style="width: 100%"
      @selection-change="selected">
        <el-table-column
          type="index"
          fixed="left"
          :label="$t('XH')"
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
          prop="name"
          :label="$t('JSMC')"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('XG')">
          <template slot-scope="params">
            <button class="edit_button" @click="dispathAuthority(params)" size="small">{{$t('FPQX')}}</button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageContainer">
      <!-- <Page size="small" class="floatLeft" ref="pages" :current="currentPage" :total='totalPage' show-total class-name="pageClass" show-elevator show-sizer :pageSize="page_size" placement="top" @change="changePage" @on-page-size-change="changePageSize"></Page> -->
      <el-pagination
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
    <div class="defaultButtonContainer">
      <default-button :text="$t('ZJ')" class-name="user_action_btn" :clickfunc='addButton'></default-button>
      <default-button :text="$t('SC')" class-name="user_action_btn" :clickfunc='deleteButton'></default-button>
    </div>
    <el-dialog center :visible.sync="allotAuthoDisplay" class="allotAutho_style" :title="allotAuthoText" :styles="allotAuthoStyle" :loading="loading">
      <div class="display_body">
        <el-form ref="popupContent" :model="popupContent" :rules="popupContentRules">
        <el-row>
          <el-form-item :label="$t('JSMC')" label-width="80px" prop="name" class="popup_FormItem" style="width: 200px">
            <el-input name="name" v-model="popupContent.name" class="popup_Input"/>
          </el-form-item>
        </el-row>
      </el-form>
      </div>
      <div class="tree">
        <el-tree :data="treeData" show-checkbox accordion multiple @check-change="treeSelectdChange" :props="{label: 'name'}" node-key="id" ref="TreeGetChecked"></el-tree>
      </div>
      <div slot="footer" class="footer">
        <default-button :text="$t('QX')" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
        <default-button :text="$t('QR')" class-name="user_action_btn" :clickfunc='allotAuthoSubmit'></default-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isDelete" center width="400px">
      <h1 slot="title">{{$t('QRSC')}}</h1>
      <div class="del_body">
        <i style="vertical-align: middle; margin-right: 10px; font-size: 36px; color: red" class="el-icon-warning"></i>
        {{$t('QRSC')}}
      </div>
      <div slot="footer" class="footer">
        <el-button type="info" @click='isDelete=false'>{{$t('QX')}}</el-button>
        <el-button type="primary" @click='deleteTure'>{{$t('QR')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apis from '@/apis'
import { mapState } from 'vuex'
import defaultButton from '@/components/defaultButton'
import searchButton from '@/components/searchButton'
import mixin from '@/mixin'
export default {
  components: { defaultButton, searchButton },
  mixins: [mixin],
  data () {
    const _this = this
    return {
      currentPage: 1, // 当前页
      page_size: 10, // 每页10条
      totalPage: 1, // 共几条
      allotAuthoText: _this.$t('TJQX'),
      allotAuthoId: [],
      batchCancelId: [],
      loading: true,
      edit: false,
      allotAuthoDisplay: false,
      allotAuthoStyle: {
        width: '400px'
      },
      searchForm: {
        name: '',
        systemId: ''
      },
      popupContent: {
        name: '',
        id: ''
      },
      tableData: [],
      treeData: [],
      isDelete: false, // 确认删除
      popupContentRules: {
        name: [{ required: true, message: _this.$t('QSRJSMC'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState(['USERNAME', 'USERTYPE', 'SYSTEMID']),
    tableHeight () {
      return document.documentElement.clientHeight - 434 + 127
    }
  },
  mounted () {
    this.searchForm.systemId = this.SYSTEMID
    this.getAssignRoleAuthoritySearch()
  },
  methods: {
    getAssignRoleAuthoritySearch () { // 获取树形
      this.$http.post(apis.GetResourceBySystemId, {id: this.searchForm.systemId}).then((res) => {
        if (res.data.code === 200) {
          this.treeData = res.data.data
        }
      })
    },
    searchInfo () {
      let searchForm = this.searchForm
      searchForm.pageSize = this.page_size
      searchForm.oageIndex = this.currentPage
      this.$http.post(apis.RoleSelect, searchForm).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.tableData = data.record
          this.totalPage = parseInt(data.totalRecord)
        }
      })
    },
    addButton () {
      this.batchCancelId = []
      this.allotAuthoDisplay = true
      setTimeout(() => {
        this.$refs.TreeGetChecked.setCheckedKeys([])
      }, 500)
      this.allotAuthoText = this.$t('TJQX')
      this.edit = false
    },
    allotAuthoSubmit () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
      this.$refs.popupContent.validate((valid) => {
        if (valid) {
          let formData = this.popupContent
          formData.systemId = this.searchForm.systemId
          formData.resourceId = this.$refs.TreeGetChecked.getCheckedKeys() // tree获取选中的id
          this.$http.post(apis.CreateOrEditSaveRoleAndRoleResource, formData).then((res) => {
            if (res.data.code === 200) {
              this.cancelButton()
              this.searchInfo()
            }
          })
        }
      })
    },
    deleteButton () {
      if (this.batchCancelId.length > 0) {
        this.isDelete = true
      } else {
        this.$message.error(this.$t('QXZYSCDJS'))
      }
    },
    deleteTure () {
      this.$http.post(apis.RoleRemove, { id: this.batchCancelId }).then(res => {
        if (res.data.code === 200) {
          this.isDelete = false
          this.searchInfo()
        }
      })
    },
    cancelButton () {
      this.allotAuthoDisplay = false
      this.popupContent = {}
      // this.treeData = []
      this.$refs.popupContent.resetFields()
      this.handleSelectAll()
    },
    treeSelectdChange (value) {
      let allotAuthoId = []
      value.map((item) => {
        allotAuthoId.push(item.key)
      })
      this.allotAuthoId = allotAuthoId
    },
    dispathAuthority (params) {
      this.batchCancelId = []
      this.batchCancelId.push(params.row.id)
      this.allotAuthoText = this.$t('FPJS')
      this.edit = true
      this.allotAuthoDisplay = true
      this.popupContent.id = params.row.id
      this.popupContent.name = params.row.name
      this.$http.post(apis.GetAuthResourceIdByRoleId, {id: params.row.id}).then((res) => {
        if (res.data.code === 200) {
          this.$refs.TreeGetChecked.setCheckedKeys(res.data.data)
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>
<style scoped>
.top {
  margin-bottom: 21px;
}
.popup_FormItem {
  float: left;
  margin: 0;
}
.search_select {
  width: 120px;
}
.bottom {
  text-align: center;
  padding: 16px;
}
.bottom span {
  font-size: 16px;
  color: #7386A6;
}
.display_body {
  margin-bottom: 20px;
}
.popup_Input {
  width: 240px;
}
</style>
<style>
.allotAutho_style .ivu-modal-body {
  padding-top: 0;
}
.edit_button {
  outline: none;
  border: none;
  cursor: pointer;
  padding: 7px 18px;
  border-radius: 14px;
  color: #fff;
  background: #a9b2ba;
}
.edit_button:hover {
  background: #617dc2;
}
.edit_button:active {
  background: #1941a2;
}
</style>
