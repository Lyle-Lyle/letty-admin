import axios from '@/api';

// 获取用户的基本信息
export const getUserApi = () =>
  axios.get<null, BaseResponse<User>>('/my/userinfo');

// 左侧菜单项的接口
export const getMenuApi = () =>
  axios.get<null, BaseResponse<MenuItem[]>>('/my/menus');
