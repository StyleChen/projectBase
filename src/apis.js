const apis = {
  UserLogin: '/Home/UserLogin.ashx', // 登录
  PictureValidateCode: '/Home/PictureValidateCode.ashx', // 获取验证码
  PasswordUpdate: '/Home/PasswordUpdate.ashx', // 修改密码
  DropdownBoxData: '/Common/DropdownBoxData.ashx', // 下拉框
  AuthorityCreateSave: '/Authority/AuthorityCreateSave.ashx', // 系统管理 - 权限管理 - 增
  AuthorityRemove: '/Authority/AuthorityRemove.ashx', // 系统管理 - 权限管理 - 删
  AuthorityEditSave: '/Authority/AuthorityEditSave.ashx', // 系统管理 - 权限管理 - 改
  AuthorityListQuery: '/Authority/AuthorityListQuery.ashx', // 系统管理 - 权限管理 - 查
  UserSearch: '/SysMg/UserSearch.ashx', // 系统管理 - 用户管理 - 查询
  UserAdd: '/SysMg/UserAdd.ashx', // 系统管理 - 用户管理 - 添加
  UserEdit: '/SysMg/UserEdit.ashx', // 系统管理 - 用户管理 - 修改
  UserEditShow: '/SysMg/UserEditShow.ashx', // 系统管理 - 用户管理 - 修改查询
  UserResetPwd: '/SysMg/UserResetPwd.ashx', // 系统管理 - 用户管理 - 重置密码
  RoleAdd: '/SysMg/RoleAdd.ashx', // 系统管理 - 角色管理 - 添加
  RoleUpdate: '/SysMg/RoleUpdate.ashx', // 系统管理 - 角色管理 - 修改
  RoleSelect: '/SysMg/RoleSelect.ashx', // 系统管理 - 角色管理 - 查询
  RoleSelectId: '/SysMg/RoleSelectId.ashx' // 系统管理 - 角色管理 - 修改查询
}

if (process.env.NODE_ENV === 'development') {
  Object.keys(apis).forEach((key) => {
    apis[key] = `/api${apis[key]}`
  })
}

export default apis
