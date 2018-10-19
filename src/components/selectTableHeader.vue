<template>
  <div>
    <el-dialog title="选择表头" center width="700px" :visible="selectTableHeaderVisible" @open="openHandle" @close="closeHandle" class="modalHeader">
      <div class="selectedHeader">
        <p class="textHeader">已选择</p>
        <div>
          <el-tooltip :disabled="item.label.length < 5" effect="dark" v-for="item in selectedHeaderArray" :key="`index${item.prop}`" :content="item.label">
            <el-button class="headerItem" type="warning">{{item.label}}
              <i :class="['closeIcon', item.hoverClass]"
              @click="deleteHeader(item)"
              @mouseover="item.hoverClass='el-icon-circle-close'"
              @mouseout="item.hoverClass='el-icon-close'"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="select">
        <p class="textHeader">未选择</p>
        <div>
          <el-tooltip :disabled="item.label.length < 5" v-show="!isSelect.includes(item.prop)" effect="dark" v-for="item in headerData" :key="item.prop" :content="item.label">
            <el-button class="headerItem" @click="selectHeader(item)">{{item.label}}</el-button>
          </el-tooltip>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="queryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    selectTableHeaderVisible: {
      default: false,
      type: Boolean
    },
    headerData: {
      default: () => {
        return [
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
            prop: 'phone',
            label: '手机',
            hoverClass: 'el-icon-close',
            headerAlign: 'center',
            align: 'center',
            width: '180'
          },
          {
            prop: 'action',
            label: '操作',
            hoverClass: 'el-icon-close',
            headerAlign: 'center',
            align: 'center',
            width: '180'
          },
          {
            prop: 'recommend_unit1',
            label: '推荐单位1',
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
            width: '180',
            minWidth: '180'
          }
        ]
      },
      type: Array
    },
    selectedHeader: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      selectedHeaderArray: [],
      isSelect: []
    }
  },
  methods: {
    closeHandle () {
      this.$emit('update:selectTableHeaderVisible', false)
    },
    selectHeader (data) {
      this.selectedHeaderArray.push(data)
    },
    deleteHeader (data) {
      data.hoverClass = 'el-icon-close'
      this.selectedHeaderArray.splice(this.selectedHeaderArray.findIndex(item => item.prop === data.prop), 1)
    },
    openHandle () {
      this.selectedHeaderArray = [].concat(this.selectedHeader)
    },
    queryConfirm () {
      this.$emit('update:selectedHeader', this.selectedHeaderArray)
      this.$emit('update:selectTableHeaderVisible', false)
    }
  },
  watch: {
    selectedHeaderArray (val) {
      this.isSelect = val.map(item => item.prop)
    }
  }
}
</script>
<style lang="less" scoped>
.selectedHeader {
  margin-bottom: 20px;
}
.textHeader {
  margin: 10px auto;
}
.headerItem {
  width: 100px;
  margin-bottom: 16px;
  margin-left: 10px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .closeIcon {
    position: absolute;
    top: 2px;
    right: 5px;
  }
}
</style>

<style lang="less">
.modalHeader {
  .el-dialog__header {
    border-bottom: 1px solid #eaeaea
  }
}
</style>
