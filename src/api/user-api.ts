import axios from '@/api'

// 获取用户的基本信息
export const getUserApi = () => axios.get<null, BaseResponse<User>>('/my/userinfo')

// 左侧菜单项的接口
export const getMenuApi = () => axios.get<null, BaseResponse<MenuItem[]>>('/my/menus')

// 更新用户的基本资料
export const updateUserInfoApi = (data: FormData) => axios.put<null, BaseResponse>('/my/userinfo', data)

// 修改密码的接口
export const updatePwdApi = (data: FormData) => axios.patch<null, BaseResponse>('/my/updatepwd', data)

// 修改头像的接口
export const updateAvatarApi = (data: FormData) => axios.patch<null, BaseResponse>('/my/update/avatar', data)
