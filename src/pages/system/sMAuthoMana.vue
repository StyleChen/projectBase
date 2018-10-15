<template>
  <div>
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-form-item label="权限名称" class="popup_FormItem" style="width: 200px">
            <el-input name="name" @change="changeData" v-model="searchForm.name" class="search_Input"/>
          </el-form-item>
          <!-- <el-form-item label="权限" :label-width="80" class="popup_FormItem">
            <Select v-model="searchForm.authority_id" @change="changeData" placeholder="" class="search_select">
              <Option value="">请选择</Option>
              <Option v-for="item in DROPDOWNBOX.province" :key="item.code" :value="item.code">{{item.label}}</Option>
            </Select>
          </el-form-item> -->
          <search-button text="查 询" class-name="user_action_btn" :clickfunc='getData'></search-button>
        </el-row>
      </el-form>
    </div>
    <zk-table :height="500" ref="table" width="100%" size="small" border :columns="tableColumns" :data="tableData" :treeType="!isexpand" :selectionType="isexpand" :expandType="isexpand">
      <template slot="actions" slot-scope="scope">
        <div>
          <Button type="default" size="small" icon="plus-round" @click="add(scope.row)">添加</Button>
          <Button type="default" size="small" icon="edit" @click="update(scope.row)">修改</Button>
          <Button type="default" size="small" icon="trash-a" @click="deleteBtn(scope.row)">删除</Button>
        </div>
      </template>
    </zk-table>
    <el-dialog :visible.sync="isAddModal" :title="isAdd ? '添加下级菜单' : '修改'">
      <el-form label-width="80px" ref="modalForm" :model="modalForm" :rules="modalRule">
        <el-row>
          <!-- <el-col span="12">
            <el-form-item label="上级菜单">
              <el-input disabled v-model="modalForm.parentMenu" />
            </el-form-item>
          </el-col> -->
          <el-col span="12">
            <el-form-item prop="name" :label="modalForm.type === 1 ? '菜单名称' : '按钮名称'">
              <el-input v-model="modalForm.name" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item prop="url" label="链接">
              <el-input v-model="modalForm.url" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item prop="type" label="菜单类型">
              <RadioGroup v-model="modalForm.type" style="margin-top: -6px">
                <Radio :label="1"><span>菜单</span></Radio>
                <Radio :label="2"><span>按钮</span></Radio>
              </RadioGroup>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="排序">
              <el-input v-model="modalForm.sort" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="footer">
        <default-button text="确认" class-name="user_action_btn" :clickfunc='addTure'></default-button>
        <default-button text="取消" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
        <!-- <Button type="text" size="small" @click="addTure">确认</Button>
        <Button type="text" size="small" @click="cancelButton">取消</Button> -->
      </div>
    </el-dialog>
    <el-dialog :visible.sync="deleteModal">
        <div class="del_body">
        <Icon style="vertical-align: middle; margin-right: 10px;" type="alert-circled" size="36" color="red"></Icon>
            确认删除
        </div>
        <div slot="footer" class="footer">
          <default-button text="确认" class-name="user_action_btn" :clickfunc='deleteTure'></default-button>
          <default-button text="取消" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
          <!-- <Button type="text" size="small" @click="deleteTure">确认</Button>
          <Button type="text" size="small" @click="cancelButton">取消</Button> -->
        </div>
    </el-dialog>
  </div>
</template>
<script>
import searchButton from '@/components/searchButton'
import defaultButton from '@/components/defaultButton'
import apis from '@/apis'
export default {
  components: { searchButton, defaultButton },
  data () {
    return {
      isAddModal: false,
      deleteModal: false,
      isAdd: true,
      params: {},
      searchForm: {
        name: ''
      },
      modalForm: {
        id: '',
        parent_id: '',
        parentMenu: '',
        type: 1,
        name: '',
        url: '',
        sort: ''
      },
      modalRule: {
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        name: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }]
      },
      isexpand: false,
      tableColumns: [
        {
          label: '菜单名称',
          align: 'left',
          headerAlign: 'center',
          prop: 'name'
        },
        {
          label: '链接',
          align: 'center',
          headerAlign: 'center',
          prop: 'url'
        },
        {
          label: '排序',
          align: 'center',
          headerAlign: 'center',
          prop: 'sort'
        },
        {
          label: '类型',
          align: 'center',
          headerAlign: 'center',
          prop: 'type_name'
        },
        {
          label: '操作',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'actions'
        }
      ],
      tableData: [],
      otherWider: 1111
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.post(apis.AuthorityListQuery, this.searchForm).then((res) => {
        this.tableData = res.data.data.records
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
    },
    add (params) { // 增
      this.isAddModal = true
      this.isAdd = true
      this.modalForm = {
        id: '',
        parent_id: params.id,
        parentMenu: '',
        type: 1,
        name: '',
        url: '',
        sort: ''
      }
    },
    addTure () { // 增
      let url = this.isAdd ? apis.AuthorityCreateSave : apis.AuthorityEditSave
      if (!this.isAdd && !this.modalForm.url) {
        this.$Message.error('请填写菜单链接')
        return
      }
      this.$http.post(url, this.modalForm).then((res) => {
        if (parseInt(res.data.status) === 1) {
          this.$refs.modalForm.resetFields()
          this.isAddModal = false
          this.getData()
        }
      })
    },
    update (params) { // 改
      this.isAddModal = true
      this.isAdd = false
      this.modalForm = params
    },
    deleteBtn (params) { // 删
      this.deleteModal = true
      this.params = params
    },
    deleteTure () { // 删
      this.$http.post(apis.AuthorityRemove, { id: this.params.id }).then((res) => {
        if (parseInt(res.data.status) === 1) {
          this.$refs.modalForm.resetFields()
          this.deleteModal = false
          this.getData()
        }
      })
    },
    cancelButton () {
      this.deleteModal = false
      this.isAddModal = false
      this.$refs.modalForm.resetFields()
      this.params = {}
    }
  }
}
</script>
<style scoped>
.popup_FormItem {
  float: left;
  margin: 0;
}
.top {
  margin-bottom: 16px;
}
.action {
  text-align: center;
  padding-bottom: 16px;
}
</style>
