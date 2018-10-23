<template>
  <div>
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row>
          <search-button :text="$t('CX')" class-name="user_action_btn" :clickfunc='getData'></search-button>
        </el-row>
      </el-form>
    </div>
    <zk-table :height="500" ref="table" width="100%" size="small" border :columns="tableColumns" :data="tableData" :treeType="!isexpand" :selectionType="isexpand" :expandType="isexpand">
      <template slot="actions" slot-scope="scope">
        <div>
          <el-button type="primary" size="mini" @click="add(scope.row)">{{$t('TJ')}}</el-button>
          <el-button type="warning" size="mini" @click="update(scope.row)">{{$t('XG')}}</el-button>
          <el-button type="danger" size="mini" @click="deleteBtn(scope.row)">{{$t('SC')}}</el-button>
        </div>
      </template>
    </zk-table>
    <el-dialog :visible.sync="isAddModal" :title="isAdd ? $t('TJXJCD') : $t('XG')">
      <el-form label-width="80px" ref="modalForm" :model="modalForm" :rules="modalRule">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="上级菜单">
              <el-input disabled v-model="modalForm.parentMenu" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item prop="name" :label="modalForm.type === 1 ? $t('CDMC') : $t('ANMC')">
              <el-input v-model="modalForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="url" :label="$t('LJ')">
              <el-input v-model="modalForm.url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="type" :label="$t('CDLX')">
              <el-select v-model="modalForm.type">
                <el-option :label="$t('CD')" value="1"></el-option>
                <el-option :label="$t('AN')" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('PX')">
              <el-input v-model="modalForm.sort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('SFYM')" prop="isScreen">
              <el-select v-model="modalForm.isScreen">
                <el-option :label="$t('YES')" value="1"></el-option>
                <el-option :label="$t('NO')" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('TBDZ')" prop="iconPath">
              <el-input v-model="modalForm.iconPath">
                <el-upload slot="append" :show-file-list="false" :limit="1" :on-success="upload" :on-error="upload" :action="uploadUrl">
                  <el-button>{{$t('UPLOAD')}}</el-button>
                </el-upload>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="footer">
        <default-button :text="$t('QX')" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
        <default-button :text="$t('QR')" class-name="user_action_btn" :clickfunc='addTure'></default-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="deleteModal">
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
import searchButton from '@/components/searchButton'
import defaultButton from '@/components/defaultButton'
import apis from '@/apis'
import { mapState } from 'vuex'
export default {
  components: { searchButton, defaultButton },
  data () {
    const _this = this
    return {
      isAddModal: false,
      deleteModal: false,
      isAdd: true,
      params: {},
      searchForm: {
        systemId: ''
      },
      uploadUrl: '',
      modalForm: {
        id: '',
        parentId: '',
        parentMenu: '',
        type: '1',
        name: '',
        url: '',
        isScreen: '1',
        iconPath: '',
        sort: ''
      },
      modalRule: {
        type: [{ required: true, message: _this.$t('QXZCDLX'), trigger: 'blur' }],
        isScreen: [{ required: true, message: _this.$t('QQRSFYM'), trigger: 'blur' }],
        name: [{ required: true, message: _this.$t('QTXCDMC'), trigger: 'blur' }]
      },
      isexpand: false,
      tableColumns: [
        {
          label: _this.$t('CDMC'),
          align: 'left',
          headerAlign: 'center',
          prop: 'name'
        },
        {
          label: _this.$t('LJ'),
          align: 'center',
          headerAlign: 'center',
          prop: 'url'
        },
        {
          label: _this.$t('PX'),
          align: 'center',
          headerAlign: 'center',
          prop: 'sort'
        },
        {
          label: _this.$t('LX'),
          align: 'center',
          headerAlign: 'center',
          prop: 'typeValue'
        },
        {
          label: _this.$t('SFYM'),
          align: 'center',
          headerAlign: 'center',
          prop: 'isScreenValue'
        },
        {
          label: _this.$t('TBDZ'),
          align: 'center',
          headerAlign: 'center',
          prop: 'iconPath'
        },
        {
          label: _this.$t('CZ'),
          align: 'center',
          width: 220,
          headerAlign: 'center',
          type: 'template',
          template: 'actions'
        }
      ],
      tableData: [],
      otherWider: 1111
    }
  },
  mounted () {
    this.searchForm.systemId = this.SYSTEMID
    this.getData()
  },
  computed: {
    ...mapState(['SYSTEMID'])
  },
  methods: {
    getData () {
      this.$http.post(apis.ResourceList, this.searchForm).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.record
        }
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
        parentId: params.id,
        type: '1',
        name: '',
        url: '',
        isScreen: '1',
        iconPath: '1',
        sort: ''
      }
    },
    addTure () { // 增
      let url = this.isAdd ? apis.ResourceCreate : apis.ResourceEditSave
      this.$refs.modalForm.validate(valid => {
        if (valid) {
          const formData = this.modalForm
          formData.systemId = this.searchForm.systemId
          this.$http.post(url, formData).then((res) => {
            if (res.data.code === 200) {
              this.$refs.modalForm.resetFields()
              this.isAddModal = false
              this.getData()
            }
          })
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
      this.$http.post(apis.ResourceRemove, { id: this.params.id }).then((res) => {
        if (res.data.code === 200) {
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
    },
    // 上传系统背景图片
    upload () {
      this.$message.error('接口待开发')
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
