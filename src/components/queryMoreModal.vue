<template>
  <div>
    <el-dialog title="高级查询" center :visible="queryClose" @close="closeHandle" @open="openHandle" custom-class="query" width="1000px">
      <el-form :model="searchQueryForm" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="searchQueryForm.name" placeholder="请选择">
                <el-option
                  v-for="item in [{value: 1, label: '男'}, {value: 0, label: '女'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="searchQueryForm.name"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国籍">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="特长">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="政治面貌">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入党时间">
              <el-date-picker
                v-model="searchQueryForm.name"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业院校">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汉外高校">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日常部门">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日常职务">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="赛时部门">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="赛时职务">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外语语种">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外语水平">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到岗时间">
              <el-date-picker
                v-model="searchQueryForm.name"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="离岗时间">
              <el-date-picker
                v-model="searchQueryForm.name"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服装尺寸">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="鞋码">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业技术职称">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人电话">
              <el-input v-model="searchQueryForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
    queryClose: {
      default: false,
      type: Boolean
    },
    searchForm: {
      default: {
        name: '',
        type: Object
      }
    }
  },
  data () {
    return {
      searchQueryForm: {
        name: ''
      }
    }
  },
  methods: {
    closeHandle () {
      this.$emit('update:queryClose', false)
    },
    openHandle () {
      this.searchQueryForm = Object.assign({}, this.searchForm, {})
    },
    queryConfirm () {
      this.$emit('update:queryClose', false)
      this.$emit('update:searchForm', this.searchQueryForm)
    }
  }
}
</script>
<style lang="less">
.query {
  .el-dialog__header {
    border-bottom: 1px solid #eaeaea
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
