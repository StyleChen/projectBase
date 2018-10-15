<template>
  <div>
    <div class="wrap">
      <div class="left_text">
        <img src="../assets/images/login_light_text.png" alt="">
        <h1>运动员信息系统</h1>
        <!-- <h2>○○○○○○</h2> -->
      </div>
      <div class="user_login">
        <img src="../assets/images/login_user_logo.png" alt="">
        <div class="input_container">
          <input type="text" placeholder="用户名"  @keyup.enter="userLogin" v-model="userName">
          <div>
            <input :type="showPwd ? 'text' : 'password'" class="password_class" placeholder="密码" @keyup.enter="userLogin" v-model="password">
            <img class="password_img" @click="showPwd=!showPwd" :src="showPwd ? require('../assets/images/eyes_open.png') : require('../assets/images/eyes_close.png')" alt="">
          </div>
          <div>
            <input type="text" placeholder="验证码" @keyup.enter="userLogin" v-model="validateCode">
            <img class="code" :src="validateCodeImg" alt="验证码" @click="validateCodeImg=`${validateCodeImg}?validateCodeImg=${Math.random()}`">
          </div>
        </div>
        <div>
          <el-checkbox v-model="isCheck">记住密码</el-checkbox>
          <el-button @click="Vue.config.lang='zh'" :type="Vue.config.lang === 'zh' ? 'primary' : 'default'">中文</el-button>
          <el-button @click="Vue.config.lang='en'" :type="Vue.config.lang === 'en' ? 'primary' : 'default'">英文</el-button>
        </div>
        <div class="login_button_container">
          <button type="submit" @click="userLogin">{{$t('LOGIN')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vue from 'vue'
import apis from '@/apis'
import Cookie from '@/assets/js/cookie'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      Vue: vue,
      showPwd: false,
      validateCodeImg: apis.PictureValidateCode,
      operate_ip: '',
      userName: '',
      password: '',
      validateCode: '',
      isCheck: false,
      USER: new Cookie('userName'), // 实例化  账号cookie
      PASSWORD: new Cookie('password'), // 密码 cookie
      ISCHECKED: new Cookie('check') // 记住密码是否勾选 cookie
    }
  },
  computed: {
    ...mapState(['NAME', 'USERNAME', 'USERTYPE', 'USERID', 'OPERATEIP']),
    myBrowser () {
      let userAgent = navigator.userAgent
      let isOpera = userAgent.indexOf('Opera') > -1
      if (isOpera) {
        return 'Opera'
      } // 判断是否Opera浏览器
      if (userAgent.indexOf('Firefox') > -1) {
        return 'FF'
      } // 判断是否Firefox浏览器
      if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome'
      }
      if (userAgent.indexOf('Safari') > -1) {
        return 'Safari'
      } // 判断是否Safari浏览器
      if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        return 'IE'
      } // 判断是否IE浏览器
    }
  },
  mounted () {
    sessionStorage.setItem('MYBROWSER', this.myBrowser)
    this.setMyBrowser(this.myBrowser)
    this.validateCodeImg = apis.PictureValidateCode + '?' + Math.random() // 更新验证码
    if (this.ISCHECKED.getCookie() === '1') {
      // 判断记住密码是否勾选
      this.isCheck = true
    }
    if (this.USER.getCookie() !== null && this.USER.getCookie() !== '0') {
      // 判断cookie中是否有保存账号
      this.userName = this.USER.getCookie()
    }
    if (
      this.PASSWORD.getCookie() !== null &&
      this.PASSWORD.getCookie() !== '0'
    ) {
      // 判断cookie中是否有保存密码
      this.password = this.PASSWORD.getCookie()
    }
  },
  methods: {
    ...mapMutations(['setUserName', 'setUserType', 'setUserId', 'setName', 'setMyBrowser', 'setAuthority']), // 获取同步操作共享状态方法
    userLogin () {
      if (this.userName.trim() === '') {
        this.$Message.error('请填写用户名！')
        return false
      }
      if (this.password.trim() === '') {
        this.$Message.error('请填写密码！')
        return false
      }
      if (this.validateCode.trim() === '') {
        this.$Message.error('请填写验证码！')
        return false
      }
      this.$http({
        method: 'post',
        url: apis.UserLogin,
        data: {
          userName: this.userName, // 登录账号
          password: this.password,
          validateCode: this.validateCode,
          operate_type: 'loginIn',
          operate_terminal: 'PC端',
          operate_ip: this.OPERATEIP,
          operate_browser: this.myBrowser
        }
      }).then(res => {
        if (parseInt(res.data.status) === 1) {
          if (this.isCheck) {
            this.USER.setCookie(this.userName, 7) // cookie 保存账号
            this.PASSWORD.setCookie(this.password, 7) // cookie 保存密码
            this.ISCHECKED.setCookie('1', 7) // cookie 保存勾选状态
          } else {
            this.USER.delCookie() // 删除 cookie
            this.PASSWORD.delCookie()
            this.ISCHECKED.delCookie()
          }
          // 使用Store 方法操作共享状态
          this.setName(res.data.data.name)
          this.setUserId(res.data.data.id)
          this.setUserName(this.userName)
          this.setUserType(res.data.data.user_type)
          this.setAuthority(res.data.data.authority)
          sessionStorage.setItem('NAME', res.data.data.name) // 用户名
          sessionStorage.setItem('USERID', res.data.data.id) // 用户名ID
          sessionStorage.setItem('USERNAME', this.userName) // 用户账号
          sessionStorage.setItem('USERTYPE', res.data.data.user_type) // 用户类型编码

          let authority = res.data.data.authority
          let newArr = []
          authority.map((item) => {
            let mapData = (child) => {
              if (child.children) {
                child.isChildrenPage = true
                child.mouseDataCount = false
                child.isActive = false
                for (let i = 0; i < child.children.length; i++) {
                  mapData(child.children[i])
                  child.children[i] = JSON.stringify(child.children[i])
                }
              }
            }
            mapData(item)
            newArr.push(JSON.stringify(item))
          })
          sessionStorage.setItem('authority', newArr.join('|')) // 用户权限
          let newA = []
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
              newA.push(newItem)
            })
            this.setAuthority(newA)
          } catch (e) {
            this.setAuthority([])
          }
          // let item = {
          //   path: '/workTable',
          //   name: '首页'
          // }
          // sessionStorage.setItem('tabs', JSON.stringify(item))
          this.$router.push({
            path: '/systemMana/sMUserMana'
          })
        } else {
          this.validateCodeImg = apis.PictureValidateCode + '?' + Math.random()
        }
      })
    }
  }
}
</script>
<style scoped>
.wrap {
  height: 100vh;
  position: relative;
  background: url(../assets/images/login_bg.png) no-repeat;
  background-size: cover;
}
.left_text {
  position: absolute;
  text-align: center;
  top: 21%;
  right: 50%;
}
.left_text h1 {
  font-size: 30px;
  color: #fff;
  font-weight: 500;
  margin-bottom: 13px;
  letter-spacing: 4px;
}
.left_text h2 {
  font-size: 18px;
  letter-spacing: 14px;
  color: #fff;
}
.user_login {
  position: absolute;
  right: 18%;
  top: 21%;
  text-align: center;
  width: 393px;
  height: 489px;
  background: rgba(250,250,250,1) url(../assets/images/login_user_bg.png) left top no-repeat;
  background-size: cover;
  border-radius: 8px;
}
.user_login img {
  margin-top: 35px;
}
.input_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 18px 0 15px 0;
  /* justify-content: center; */
}
.password_class {
  margin: 18px 0;
}
.password_img {
  cursor: pointer;
  position: absolute;
  right: 55px;
  bottom: 197px;
}
.input_container input {
  padding-left: 18px;
  outline: none;
  border: 1px solid #E8E8E9;
  width: 320px;
  height: 40px;
  background: #EBEBEB;
  border-radius: 25px;
}
.input_container input:focus {
  background-color: #fff;
}
.input_container input:hover {
  background-color: #fff;
}
.login_button_container {
  margin-top: 15px;
}
.login_button_container button {
  cursor: pointer;
  outline: none;
  border: none;
  width: 320px;
  height: 50px;
  background: rgba(38,68,125,1);
  color: #fff;
  border-radius: 25px;
}
.code {
  position: absolute;
  right: 55px;
  bottom: 135px;
}
</style>
