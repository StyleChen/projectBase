import Vue from 'vue'
import Vuex from 'vuex'
import apis from '@/apis'
import axios from 'axios'
import 'babel-polyfill'

Vue.use(Vuex)

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
} catch (e) {

}
console.log(newA)
newA = [
  {
    create_time: '2018-09-19 15:31:23',
    icon: '2',
    id: 2,
    isActive: false,
    isChildrenPage: true,
    map_id: 120,
    mouseDataCount: false,
    name: 'demo',
    parent_id: 0,
    sort: 99,
    type: 1,
    url: '/demo'
  },
  {
    create_time: '2018-09-19 15:31:23',
    icon: '7',
    id: 1,
    isActive: false,
    isChildrenPage: true,
    map_id: 130,
    mouseDataCount: false,
    name: '系统管理',
    parent_id: 0,
    sort: 99,
    type: 1,
    url: '/systemMana',
    children: [
      {
        create_time: '2018-09-19 15:31:24',
        id: 28,
        map_id: 129,
        name: '用户管理',
        parent_id: 1,
        sort: 10,
        type: 1,
        url: '/systemMana/sMUserMana'
      },
      {
        create_time: '2018-09-19 15:31:24',
        id: 29,
        map_id: 131,
        name: '角色管理',
        parent_id: 1,
        sort: 20,
        type: 1,
        url: '/systemMana/sMRoleMana'
      },
      {
        create_time: '2018-09-19 15:31:24',
        id: 30,
        map_id: 132,
        name: '权限管理',
        parent_id: 1,
        sort: 30,
        type: 1,
        url: '/systemMana/sMAuthoMana'
      }
    ]
  }
]
// 共享状态
const state = {
  NAME: sessionStorage.getItem('NAME') || '', // 当前用户名
  USERNAME: sessionStorage.getItem('USERNAME') || '', // 当前账号
  USERTYPE: sessionStorage.getItem('USERTYPE') || '', // 当前用户类型
  USERID: sessionStorage.getItem('USERID') || '', // 当前用户ID
  MYBROWSER: sessionStorage.getItem('MYBROWSER') || '', // 浏览器
  DROPDOWNBOX: JSON.parse(sessionStorage.getItem('DROPDOWNBOX')) || {
    stage: [],
    province: [],
    country: [],
    sport_level: [],
    sport_project: []
  }, // 公共下拉框
  // authority: JSON.parse(sessionStorage.getItem('authority')) // 公共下拉框
  authority: newA // 用户权限
}

function dropBox () {
  axios.post(apis.DropdownBoxData).then((res) => {
    if (res.data.status === '1') {
      let data = res.data.data
      let DropdownBox = {}
      for (let i in data) {
        DropdownBox[i] = data[i]
      }
      state.DROPDOWNBOX = DropdownBox
      sessionStorage.setItem('DROPDOWNBOX', JSON.stringify(DropdownBox))
    }
  })
}
dropBox()
// 同步操作共享状态
const mutations = {
  setDropDownbox (state, payload) {
    state.DROPDOWNBOX = payload
  },
  setUserName (state, payload) {
    state.USERNAME = payload
  },
  setName (state, payload) {
    state.NAME = payload
  },
  setUserType (state, payload) {
    state.USERTYPE = payload
  },
  setUserId (state, payload) {
    state.USERID = payload
  },
  setMyBrowser (state, payload) {
    state.MYBROWSER = payload
  },
  setAuthority (state, payload) {
    state.authority = payload
  }
}

export default new Vuex.Store({
  state,
  mutations
})
