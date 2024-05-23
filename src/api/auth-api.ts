import axios from '@/api'

// 注册的 API 接口
export const regApi = (data: FormData) => axios.post<null, BaseResponse>('/api/reg', data)

// 登录的 API 接口
export const loginApi = (data: FormData) => axios.post<null, LoginResponse>('/api/login', data)
