<template>
  <div>
    <el-dialog title="选择表头" center width="1000px" :visible="selectTableHeaderVisible" @close="closeHandle" class="modalHeader">
      <div>
        <p>未选择</p>
        <div>
          <el-button>姓名</el-button>
          <el-button>国籍</el-button>
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
    }
  },
  methods: {
    closeHandle () {
      this.$emit('update:selectTableHeaderVisible', false)
    },
    queryConfirm () {}
  }
}
</script>

<style lang="less">
.modalHeader {
  .el-dialog__header {
    border-bottom: 1px solid #eaeaea
  }
}
</style>
