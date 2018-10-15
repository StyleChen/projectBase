<template>
  <div>
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-form-item label="角色名称" class="popup_FormItem" style="width: 200px">
            <el-input name="name" @change="changeData" v-model="searchForm.name" class="search_Input"/>
          </el-form-item>
          <!-- <el-form-item label="权限" :label-width="80" class="popup_FormItem">
            <Select v-model="searchForm.authority_id" @change="changeData" placeholder="" class="search_select">
              <Option value="">请选择</Option>
              <Option v-for="item in DROPDOWNBOX.province" :key="item.code" :value="item.code">{{item.label}}</Option>
            </Select>
          </el-form-item> -->
          <search-button text="查 询" class-name="user_action_btn" :clickfunc='searchButton'></search-button>
        </el-row>
      </el-form>
    </div>
    <div class="tableBackgroundDiv">
    <!-- <Table :height="tableHeight" ref="table" width="100%" size="small" :row-class-name="rowClassName" :columns="tableColumns" :data="tableData" @on-selection-change="selected" @on-select="selected" @on-select-cancel="selected" @on-select-all="selected"></Table> -->
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
          prop="name"
          label="角色名称"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="修改">
          <template slot-scope="params">
            <button class="edit_button" @click="dispathAuthority(params)" size="small">分配权限</button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button_container">
      <default-button text="增 加" class-name="user_action_btn" :clickfunc='addButton'></default-button>
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
    <el-dialog :visible.sync="allotAuthoDisplay" class="allotAutho_style" :title="allotAuthoText" :styles="allotAuthoStyle" :mask-closable="false" :closable="false" :loading="loading">
      <div class="display_body">
        <el-form ref="popupContent" :model="popupContent" :rules="popupContentRules">
        <el-row>
          <el-form-item label="角色名称" :label-width="80" prop="name" class="popup_FormItem" style="width: 200px">
            <el-input name="name" v-model="popupContent.name" class="popup_Input"/>
          </el-form-item>
        </el-row>
      </el-form>
      </div>
      <div class="tree">
        <el-tree :data="treeData" show-checkbox multiple @check-change="treeSelectdChange" ref="TreeGetChecked"></el-tree>
      </div>
      <div slot="footer" class="footer">
        <default-button text="确认" class-name="user_action_btn" :clickfunc='allotAuthoSubmit'></default-button>
        <default-button text="取消" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
        <!-- <Button type="text" size="small" @click="allotAuthoSubmit">确认</Button>
        <Button type="text" size="small" @click="cancelButton">取消</Button> -->
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
    return {
      currentPage: 1, // 当前页
      page_size: 10, // 每页10条
      totalPage: 1, // 共几条
      allotAuthoText: '添加权限',
      allotAuthoId: [],
      batchCancelId: [],
      loading: true,
      edit: false,
      allotAuthoDisplay: false,
      allotAuthoStyle: {
        width: '400px'
      },
      searchForm: {
        name: ''
      },
      popupContent: {
        name: ''
      },
      tableColumns: [
        {
          title: '全选',
          fixed: 'left',
          align: 'center',
          width: 70,
          type: 'selection'
        },
        {
          title: '角色名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '修改',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('button', {
                props: {
                  type: 'submit'
                },
                class: [
                  'edit_button'
                ],
                on: {
                  click: () => {
                    this.batchCancelId = []
                    this.batchCancelId.push(params.row.id)
                    this.getAssignRoleAuthoritySearch()
                    this.allotAuthoText = '分配权限'
                    this.edit = true
                    this.allotAuthoDisplay = true
                    this.popupContent.id = this.batchCancelId.join()
                    this.$http.post(apis.RoleSelectId, {id: this.batchCancelId.join()}).then((res) => {
                      if ((res.data.status).toString() === '1') {
                        let data = res.data.data
                        this.popupContent.name = data.name
                        this.$forceUpdate()
                      }
                    })
                  }
                }
              }, '分配权限')
            ])
          }
        }
      ],
      tableData: [],
      treeData: [],
      popupContentRules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
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
    getAssignRoleAuthoritySearch () { // 获取树形
      let treeData = []
      this.$http.post(apis.AssignRoleAuthoritySearch, {role_id: this.batchCancelId.join(',')}).then((res) => {
        if ((res.data.status).toString() === '1') {
          let data = res.data.data
          data.records.map((item) => {
            let obj = {
              expand: true,
              key: item.key,
              title: item.title,
              children: item.children,
              checked: item.checked
            }
            let resetChildCheck = (itemObj) => {
              itemObj.children && itemObj.children.map((childrenItem) => {
                childrenItem.expand = true
                if (!childrenItem.checked) {
                  itemObj.checked = false
                }
                resetChildCheck(childrenItem)
              })
            }
            resetChildCheck(obj)
            treeData.push(obj)
          })
          this.treeData = treeData
          this.$forceUpdate()
        }
      })
    },
    searchInfo () {
      let searchForm = this.searchForm
      searchForm.pageSize = this.page_size
      searchForm.currentPage = this.currentPage
      this.$http.post(apis.RoleSelect, searchForm).then((res) => {
        if ((res.data.status).toString() === '1') {
          let data = res.data.data
          this.tableData = data.records
          this.totalPage = parseInt(data.totalRecord)
        }
      })
    },
    addButton () {
      this.batchCancelId = []
      this.getAssignRoleAuthoritySearch()
      this.allotAuthoText = '添加权限'
      this.allotAuthoDisplay = true
      this.edit = false
    },
    allotAuthoSubmit () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
      let allotAuthoAry = []
      this.treeData.map((item) => {
        let pushKey = (itemObj) => {
          if (!itemObj.children && this.allotAuthoId.indexOf(itemObj.key) !== -1 && allotAuthoAry.indexOf(itemObj.key) === -1) {
            allotAuthoAry.push(itemObj.key)
          }
          itemObj.children && itemObj.children.map((childrenItem) => {
            if (this.allotAuthoId.indexOf(childrenItem.key) !== -1 && allotAuthoAry.indexOf(childrenItem.key) === -1) {
              allotAuthoAry.push(childrenItem.key)
              if (allotAuthoAry.indexOf(itemObj.key) === -1) {
                allotAuthoAry.push(itemObj.key)
              }
            }
            pushKey(childrenItem)
          })
        }
        pushKey(item)
      })
      // console.log(this.allotAuthoId)
      // console.log(allotAuthoAry)
      this.$refs.popupContent.validate((valid) => {
        if (valid) {
          let apisUrl = this.edit ? apis.RoleUpdate : apis.RoleAdd
          let formData = this.popupContent
          formData.authority_ids = allotAuthoAry.join(',')
          formData.role_id = this.batchCancelId.join('')
          this.$http.post(apisUrl, formData).then((res) => {
            if ((res.data.status).toString() === '1') {
              this.cancelButton()
              this.searchInfo()
            }
          })
        }
      })
    },
    cancelButton () {
      this.allotAuthoDisplay = false
      this.popupContent = {}
      this.treeData = []
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
      this.getAssignRoleAuthoritySearch()
      this.allotAuthoText = '分配权限'
      this.edit = true
      this.allotAuthoDisplay = true
      this.popupContent.id = this.batchCancelId.join()
      this.$http.post(apis.RoleSelectId, {id: this.batchCancelId.join(',')}).then((res) => {
        if ((res.data.status).toString() === '1') {
          let data = res.data.data
          this.popupContent.name = data.name
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
