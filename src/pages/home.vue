
<template>
    <div class="layout">
        <el-container>
            <el-aside class="sider" ref="side1" :width="!isCollapsed ? '220px' : '120px'" :style="{overflow: !isCollapsed ? 'auto' : 'visible'}">
              <div class="log">
                <img src="../assets/images/logo_new.png" alt="log" class="img-responsive" style="width: 70px">
              </div>
              <div class="asider">
                <ul>
                  <template v-for="(item, index) in authority" v-if="(parseInt(USERTYPE) !== 2) || (item.url !== '/dataEntry')">
                    <el-tooltip v-if="!item.children" :disabled="!isCollapsed" :content="item.name" placement="right-end" :key="item.id">
                      <router-link tag="li" :to="item.url" :class="['liPage',  !isCollapsed ? '' : 'borderNone']">
                        <div :class="['pageItem', `nav_${index}`]">
                          <div class="menu_icon" :style="{marginRight: !isCollapsed ? '0' : '22px'}"><img :src="item.isActive ? require(`../assets/images/nav_active_${item.icon}.png`) : require(`../assets/images/nav_${item.icon}.png`)" alt=""></div>
                          <span v-show="!isCollapsed">{{item.name}}</span>
                        </div>
                      </router-link>
                    </el-tooltip>
                    <el-tooltip v-if="item.children" :key="item.id" :disabled="!isCollapsed || item.mouseDataCount" placement="right-end">
                      <div slot="content">
                        <p v-for="children in item.children" :key="children.id">{{children.name}}</p>
                      </div>
                      <li tag="li" :to="item.url" :class="['liPage', item.mouseDataCount || item.isActive ? 'router-link-active' : '',  !isCollapsed ? '' : 'borderNone']" @click.prevent="item.isChildrenPage = !item.isChildrenPage">
                        <div :class="['pageItem', `nav_${item.icon}`]" @click="item.mouseDataCount=isCollapsed" @mouseleave="item.mouseDataCount=false">
                          <!-- <Icon type="android-arrow-dropdown" color="#FFF" v-show="!isCollapsed" :class="{childrenPageIcon: item.isChildrenPage}" :size="22" style="float: right; margin-top: 15px; margin-right: 20px"></Icon> -->
                          <div class="menu_icon" :style="{marginRight: !isCollapsed ? '0' : '22px'}"><img :src="item.isActive ? require(`../assets/images/nav_active_${item.icon}.png`) : require(`../assets/images/nav_${item.icon}.png`)" alt=""></div>
                          <span v-show="!isCollapsed">{{item.name}}</span>
                          <ul :class="['childrenPage', item.mouseDataCount ? 'absoluteUl' : '']" v-show="(!isCollapsed && !item.isChildrenPage) || item.mouseDataCount">
                            <router-link tag="li" v-for="children in item.children" @click.native.prevent.stop="()=>{}" :key="children.id" :to="children.url" class="childrenLi">
                              <div class="childrenText">{{children.name}}</div>
                            </router-link>
                          </ul>
                        </div>
                      </li>
                    </el-tooltip>
                  </template>
                </ul>
              </div>
              <div class="controler" :style="{width: isCollapsed ? '120px' : '220px'}">
                <span class="control" @click="collapsedSider">
                  <img src="../assets/images/collapse.png" alt="" :style="{transform: isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)'}">
                  <span class="titleText">{{isCollapsed ? '扩张' : '收起'}}</span>
                </span>
              </div>
            </el-aside>
            <el-container :class="{layoutCustom: isCollapsed, cLayout: true}">
                <el-header :style="{padding: 0}" class="layout-header-bar">
                  <div class="header_top">
                    <h1 class="mainTitle">运动员信息系统</h1>
                    <div class="user">
                      <span>欢迎您，{{NAME}}</span>
                      <el-tooltip content="修改密码" placement="bottom">
                        <img style="height: 15px; width: 15px;" src="../assets/images/passwordKey.png" alt="修改密码" @click="modifyPasswordButton">
                      </el-tooltip>
                      <el-tooltip content="退出" placement="bottom">
                        <img src="../assets/images/logout.png" alt="退出" @click="outButton">
                      </el-tooltip>
                    </div>
                  </div>
                  <ul class="tabPages">
                    <router-link tag="li" :to="item.path" v-for="(item, index) in tabs" :key="item.path+index">
                      <div class="close"><i class="el-icon-close" style="color: #B6BAC2" @click.prevent="colseTab(index)"></i></div>
                      <span class="tabsName">{{item.name}}</span>
                    </router-link>
                  </ul>
                </el-header>
                <el-main :style="{margin: '20px', marginTop: '103px', background: '#fff', minHeight: 'calc(100vh - 125px)'}">
                    <keep-alive><router-view></router-view></keep-alive>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog :visible.sync="modifyPasswordDisplay" :styles="modifyPasswordStyle" title="修改密码">
            <div class="del_body">
              <el-form ref="popupContent" :model="popupContent" :rules="popupContentRules" label-width="100px">
                <el-row>
                  <el-col :sm="12" :md="8" :lg="24">
                    <el-form-item label="旧密码" prop="oldPassword" class="popupContent_FormItem">
                      <el-input type="password" v-model="popupContent.oldPassword" class="popup_Input"/>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="8" :lg="24">
                    <el-form-item label="新密码" prop="newPassword" class="popupContent_FormItem">
                      <el-input type="password" v-model="popupContent.newPassword" class="popup_Input"/>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :md="8" :lg="24">
                    <el-form-item label="确认新密码" prop="confirmNewPassword" class="popupContent_FormItem">
                      <el-input type="password" v-model="popupContent.confirmNewPassword" class="popup_Input"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div slot="footer" class="footer">
              <default-button text="确认" class-name="user_action_btn" :clickfunc='modifyPasswordSubmit'></default-button>
              <default-button text="取消" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
                <!-- <Button type="text" size="small" @click="modifyPasswordSubmit">确认</Button>
                <Button type="text" size="small" @click="cancelButton">取消</Button> -->
            </div>
        </el-dialog>
        <el-dialog :visible.sync="outDisplay" :styles="outPopupStyle" :mask-closable="false" :closable="false" :loading="loading">
            <div class="del_body">
              <i style="vertical-align: middle; margin-right: 10px; font-size: 36px; color: red" class="el-icon-warning"></i>
                是否退出
            </div>
            <div slot="footer" class="footer">
              <default-button text="确认" class-name="user_action_btn" :clickfunc='outSubmit'></default-button>
              <default-button text="取消" class-name="user_action_btn" :clickfunc='cancelButton'></default-button>
                <!-- <Button type="text" size="small" @click="outSubmit">确认</Button>
                <Button type="text" size="small" @click="cancelButton">取消</Button> -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import apis from '@/apis'
import { mapState, mapMutations } from 'vuex'
import defaultButton from '@/components/defaultButton'
export default {
  components: { defaultButton },
  componentName: 'home',
  data () {
    const validateConfirmNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
      } else if (this.popupContent.newPassword === this.popupContent.confirmNewPassword) {
        callback()
      } else {
        callback(new Error('确认密码与新密码不一致'))
      }
    }
    return {
      mouseData: false,
      mouseDataCount: false,
      mouseDataSystem: false,
      isCollapsed: false,
      isDataStatisticsPage: false,
      isChildrenPage: false,
      isSystemManaPage: false,
      outDisplay: false,
      modifyPasswordDisplay: false,
      loading: true,
      outPopupStyle: { // 弹窗宽度设置
        width: '420px'
      },
      modifyPasswordStyle: { // 弹窗宽度设置
        width: '420px'
      },
      popupContent: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      activePage: 1,
      tabs: [],
      isOpendTabs: [],
      popupContentRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmNewPassword: [{ required: true, validator: validateConfirmNewPassword, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    let tabs = sessionStorage.getItem('tabs')
    if (!tabs) {
      this.tabs = [
        {
          path: '/workTable',
          name: '首页'
        }
      ]
    } else {
      let newArr = tabs.split('|')
      newArr.map(item => {
        this.tabs.push(JSON.parse(item))
      })
    }
  },
  computed: {
    ...mapState(['NAME', 'USERID', 'COMPANY', 'USERTYPE', 'authority', 'DROPDOWNBOX']),
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses () {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  methods: {
    ...mapMutations([
      'setName',
      'setUserName',
      'setUserType',
      'setUserId',
      'setCompany',
      'setAuthority',
      'setDropDownbox'
    ]),
    collapsedSider () {
      this.isCollapsed = !this.isCollapsed
    },
    colseTab (index) {
      let isOpendTabs = this.isOpendTabs
      isOpendTabs.forEach((item, index) => {
        if (item.path === this.$route.path) {
          isOpendTabs.splice(index, 1)
        }
      })
      if (index < this.tabs.length - 1) {
        this.$router.push(this.tabs[index + 1].path)
      } else if (this.tabs.length === 1) {
        this.$router.push('/workTable')
      } else {
        this.$router.push(this.tabs[index - 1].path)
      }
      this.tabs.splice(index, 1)
      let newArr = []
      this.tabs.map(item => {
        newArr.push(JSON.stringify(item))
      })
      sessionStorage.setItem('tabs', newArr.join('|'))
    },
    outButton () {
      this.outDisplay = true
    },
    outSubmit () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
      sessionStorage.clear()
      this.setName('')
      this.setUserName('')
      this.setUserType('')
      this.setUserId('')
      this.setAuthority('')
      this.$router.push('/login')
    },
    modifyPasswordButton () {
      this.modifyPasswordDisplay = true
    },
    modifyPasswordSubmit () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
      this.$refs.popupContent.validate((valid) => {
        if (valid) {
          let formData = this.popupContent
          this.$http.post(apis.PasswordUpdate, formData).then((res) => {
            if ((res.data.status).toString() === '1') {
              this.modifyPasswordDisplay = false
              this.$refs.popupContent.resetFields()
              this.popupContent = {}
              sessionStorage.clear()
              this.setName('')
              this.setUserName('')
              this.setUserType('')
              this.setUserId('')
              this.setAuthority('')
              this.$router.push('/login')
            }
          })
        }
      })
    },
    cancelButton () {
      this.outDisplay = false
      this.modifyPasswordDisplay = false
      this.popupContent = {}
      this.$refs.popupContent.resetFields()
    }
  },
  watch: {
    $route (to, from) {
      let tabs = sessionStorage.getItem('tabs')
      let nextTabs = {
        path: to.fullPath,
        name: to.meta.title
      }
      if (!tabs || !tabs.includes(JSON.stringify(nextTabs))) {
        this.tabs.push(nextTabs)
        let newArr = []
        this.tabs.map(item => {
          newArr.push(JSON.stringify(item))
        })
        sessionStorage.setItem('tabs', newArr.join('|'))
      }
      let newAuthority = this.authority.map((item) => {
        let toUrl = to.fullPath.split('/')[1]
        if (item.url.includes(toUrl)) {
          item.isActive = true
        } else {
          item.isActive = false
        }
        return item
      })
      let newAuthorityArr = []
      newAuthority.map((item) => {
        let mapData = (child) => {
          if (child.children) {
            for (let i = 0; i < child.children.length; i++) {
              mapData(child.children[i])
              child.children[i] = JSON.stringify(child.children[i])
            }
          }
        }
        mapData(item)
        newAuthorityArr.push(JSON.stringify(item))
      })
      sessionStorage.setItem('authority', newAuthorityArr.join('|')) // 用户权限
      let newAA = []
      try {
        sessionStorage.getItem('authority').split('|').map((item) => {
          let newItem = JSON.parse(item)
          let mapData = (child) => {
            if (child.children) {
              for (let i = 0; i < child.children.length; i++) {
                child.children[i] = JSON.parse(child.children[i])
                mapData(child.children[i])
              }
            }
          }
          mapData(newItem)
          newAA.push(newItem)
        })
      } catch (e) {

      }
      this.setAuthority(newAA)
    }
  }
}
</script>
<style scoped>
.sider {
  transition: all 0.2s ease-in-out;
}
.asider {
  padding-bottom: 76px;
}
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  /* overflow: hidden; */
}
.layout-header-bar {
  box-sizing: content-box;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 220px);
  transition: all 0.2s ease-in-out;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.cLayout {
  box-sizing: content-box;
  transition: all 0.2s ease-in-out;
  background: #F2F5F9 url(../assets/images/mainBg.png) left bottom repeat;
}
.layoutCustom .layout-header-bar {
  width: calc(100% - 120px);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-180deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

/* const */
.controler {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 220px;
  height: 73px;
  line-height: 73px;
  text-align: center;
  background: #24385A;
}
.control {
  display: block;
  position: relative;
  overflow: hidden;
  margin: 0 17px;
  border-top: 1px solid;
  cursor: pointer;
  border-image: linear-gradient(90deg,rgba(158,171,193,0.26),rgba(158,171,193,0.76),rgba(158,171,193,0.26)) 30 30;
}
.control img {
  vertical-align: middle;
  transition: all 0.2s linear;
}
.titleText {
  font-size: 12px;
  color: #FFF;
  margin-left: 6px;
}
.log {
  height: 82px;
  padding: 0 10px;
  text-align: center;
  background: rgba(0, 31, 95, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.routeImg {
  vertical-align: middle;
  margin-right: 12px;
}
.collapsed-menu .routeImg {
  margin-right: 0;
}
.liPage {
  cursor: pointer;
  padding: 4px 0;
  margin: 0 24px;
}
.router-link-active.liPage {
  border-bottom: 1px solid;
  border-image: linear-gradient(90deg,rgba(158,171,193,0.26),rgba(158,171,193,0.76),rgba(158,171,193,0.26)) 30 30;
}
.borderNone.liPage {
  border: none !important;
}
.pageItem {
  display: block;
  position: relative;
  min-height: 47px;
  line-height: 47px;
  border-left: 2px solid transparent;
  color: #FFF;
  font-size: 14px;
  padding-left: 11px;
}
.pageItem .absoluteUl {
  position: absolute;
  width: 170px;
  z-index: 999;
  top: 0;
  left: 120px;
}
.pageItem .absoluteUl li{
  background: rgba(0, 0, 0, 0.5);
  color: #FFF;
  margin-left: 30px;
}
.pageImg {
  margin-left: 25px;
  margin-right: 12px;
  position: relative;
  top: 3px;
}
.router-link-active .menu_icon {
  background: #0FBA77;
}
.menu_icon {
  float: right;
  width: 26px;
  height: 26px;
  border-radius: 2px;
  background: rgba(2, 18, 46, 0.45);
  text-align: center;
  margin-top: 10px;
}
.menu_icon img {
  position: relative;
  top: -8px;
}
.childrenPage {
  margin-left: -56px;
  border-top: 1px solid transparent;
}
.childrenPage li {
  color: #77849B;
  padding: 5px 0;
  padding-left: 58px;
  font-size: 12px;
}
.childrenPage li .childrenText {
  height: 28px;
  line-height: 28px;
  padding-left: 10px;
}
.absoluteUl li {
  padding-left: 0;
  margin-left: 10px;
}
.absoluteUl li .childrenText {
  padding-left: 25px;
}
.absoluteUl li:hover .childrenText,
.childrenPage li:hover {
  color: #FFF;
}
.absoluteUl li.router-link-active .childrenText,
.childrenPage li.router-link-active {
  color: #fff;
}
.childrenPageIcon {
  transform: rotate(180deg);
}
.pageItem i {
  transition: all 0.2s;
}
/* header */
.header_top {
  overflow: hidden;
  background: #FFF url(../assets/images/header.png) left center no-repeat;
  background-size: 1920px 57px;
}
.mainTitle {
  float: left;
  height: 47px;
  line-height: 47px;
  vertical-align: middle;
  margin-left: 120px;
  font-size: 16px;
  color: #1a3b60;
  font-weight: 600;
}
.user {
  float: right;
  height: 47px;
  line-height: 47px;
  font-size: 12px;
  color: #1a3b60;
  margin-right: 22px;
}
.user img {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 10px;
}
/* tabs */
.tabPages {
  height: 36px;
  overflow: hidden;
  line-height: 36px;
  /* background: #e3e9f2 url(../assets/images/nav_tabs.png) left center repeat; */
  background: #FFF;
}
.tabPages li {
  position: relative;
  float: left;
  height: 36px;
  text-align: center;
  font-size: 12px;
  color: #697487;
}
.tabsName {
  position: relative;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 20px;
}
.tabPages li.router-link-active .tabsName::after {
  position: absolute;
  content: '';
  bottom: 0;
  width: 36px;
  height: 3px;
  background: #3F96E1;
  left: calc(50% - 18px);
}
.close {
  float: right;
  padding-right: 10px;
  position: relative;
}
.close::after {
  position: absolute;
  right: 0;
  top: 13px;
  content: '';
  height: 14px;
  width: 2px;
  background: #E8E9EC;
}
.del_body {
  padding-right: 50px;
  padding-bottom: 0;
  text-align: center;
}
</style>
<style>
.sider {
  background: #003791 url(../assets/images/aside_new.png) center top no-repeat;
}
</style>
