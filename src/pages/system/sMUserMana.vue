<template>
  <div>
    <!-- <keep-alive><router-view></router-view></keep-alive> -->
    <div class="top">
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row class="searchWrap">
          <el-col :span="6">
            <el-form-item :label="$t('ZH')">
              <el-input size="mini" name="userName" @change="changeData" v-model="searchForm.userName" class="search_Input"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('XM')">
              <el-input size="mini" name="name" @change="changeData" v-model="searchForm.name" class="search_Input"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('YX')">
              <el-input size="mini" name="email" @change="changeData" v-model="searchForm.email" class="search_Input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <search-button :text="$t('CX')" :clickfunc='searchButton'></search-button>
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
          prop="userName"
          :label="$t('ZH')"
          header-align="center"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          :label="$t('XM')"
          width="200">
        </el-table-column>
        <el-table-column
          prop="email"
          header-align="center"
          align="center"
          :label="$t('YX')"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="enabled"
          header-align="center"
          align="center"
          :label="$t('ZT')"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('CZ')"
          width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addButton(scope)">{{$t('FPJS')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageContainer">
      <!-- <Page size="small" class="floatLeft" ref="pages" :current="pageIndex" :total='totalPage' show-total class-name="pageClass" show-elevator show-sizer :pageSize="pageSize" placement="top" @change="changePage" @on-page-size-change="changePageSize"></Page> -->
      <el-pagination
      @size-change="changePageSize"
      @current-change="changePage"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      class="floatLeft"
      ref="pages"></el-pagination>
    </div>
    <div class="defaultButtonContainer">
      <default-button :text="$t('FPJS')" :clickfunc='addButton'></default-button>
    </div>
    <el-dialog :visible.sync="popupDisplay" center width="700px">
      <h1 slot="title">{{$t('FPJS')}}</h1>
      <div class="popup_body">
        <el-form ref="popupContent" :model="popupContent" label-width="100px">
          <div class="user-mana-transfer">
            <el-form-item :label="$t('FPJS')">
              <el-transfer
              :data ="transferData"
              v-model="transferTargetKeys"
              :titles="[$t('SYJS'), $t('YXJS')]"
              :props="{key: 'code', label: 'value'}"
              :left-default-checked="defaultTransferData"></el-transfer>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button type="info" @click='popupDisplay=false;$refs.table.clearSelection()'>{{$t('QX')}}</el-button>
        <el-button type="primary" @click='confirmSubmit'>{{$t('QR')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import apis from '@/apis'
import { mapState, mapMutations } from 'vuex'
import defaultButton from '@/components/defaultButton'
import searchButton from '@/components/searchButton'
import mixin from '@/mixin'
export default {
  components: { defaultButton, searchButton },
  mixins: [mixin],
  data () {
    return {
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页10条
      totalPage: 1, // 共几条
      batchCancelId: [],
      transferData: [],
      transferTargetKeys: [],
      defaultTransferData: [],
      popupDisplay: false,
      searchForm: {
        systemId: '',
        userName: '',
        name: '',
        email: ''
      },
      popupContent: {
        role: ''
      },
      tableData: []
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
    this.getTransferData()
  },
  methods: {
    ...mapMutations(['setUserName', 'setUserType', 'setName']),
    getTransferData () { // 穿梭框取值
      this.$http.post(apis.GetRoleBySystemId, {id: this.searchForm.systemId}).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.transferData = data.record
        }
      })
    },
    searchInfo () {
      let searchForm = this.searchForm
      searchForm.pageSize = this.pageSize
      searchForm.pageIndex = this.pageIndex
      this.$http.post(apis.UserSearch, searchForm).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.tableData = data.record
          this.totalPage = parseInt(data.totalRecord)
        }
      })
    },
    addButton (scope) {
      if (scope.row) {
        this.$refs.table.toggleRowSelection(scope.row)
        this.$http.post(apis.GetRoleIdBySystemIdAndUserId, {systemId: this.searchForm.systemId, userId: scope.row.id}).then(res => {
          if (res.data.code === 200) {
            this.popupDisplay = true
            this.transferTargetKeys = res.data.data
          }
        })
      } else if (this.batchCancelId.length > 0) {
        this.popupDisplay = true
        this.transferTargetKeys = []
      } else {
        this.$message.error(this.$t('QXZZH'))
      }
    },
    confirmSubmit () {
      this.$http.post(apis.BatchSaveUserRoles, {
        systemId: this.searchForm.systemId,
        userId: this.batchCancelId,
        roleId: this.transferTargetKeys
      }).then(res => {
        if (res.data.code === 200) {
          this.popupDisplay = false
          this.$refs.table.clearSelection()
          this.transferTargetKeys = []
          this.searchInfo()
        }
      })
    }
  }
}
</script>
<style scoped>
.searchWrap {
  display: inline-block;
  width: calc(100% - 170px);
}
.top {
  margin-bottom: 17px;
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
