import axios from '@/api';

// Registe API
export const regApi = (data: FormData) =>
  axios.post<null, BaseResponse>('/api/reg', data);

// login API
export const loginApi = (data: FormData) =>
  axios.post<null, LoginResponse>('/api/login', data);
