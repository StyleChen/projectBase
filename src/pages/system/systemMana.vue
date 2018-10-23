<template>
  <div class="system">
    <keep-alive><router-view></router-view></keep-alive>
  </div>
</template>
<style>
.system {
  padding: 20px;
}
.system .el-dialog__header,
.system .el-dialog__body,
.system .el-dialog__footer {
  padding: 20px 20px 10px;
}
</style>
