/// <reference types="vite/client" />

// 请求体的数据类型
type RegisterForm = {
  username: string;
  password: string;
  repassword: string;
};

// 排除一个项
type LoginForm = Omit<RegisterForm, 'repassword'>;

// 接口返回的数据类型
interface BaseResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

interface LoginResponse extends BaseResponse {
  token: string;
}

// 用户的基本信息
type User = {
  readonly id: number;
  username: string;
  nickname?: string;
  email?: string;
  user_pic?: string;
};

// 左侧菜单项的 TS 类型
type MenuItem = {
  readonly key: string;
  title?: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
};
