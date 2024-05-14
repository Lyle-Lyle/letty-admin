import axios from '@/api';

// Registe API
export const regApi = (data: FormData) => axios.post('/api/reg', data);
