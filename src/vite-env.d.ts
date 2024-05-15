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
interface BaseResponse {
  code: number;
  message: string;
}

interface LoginResponse extends BaseResponse {
  token: string;
}
