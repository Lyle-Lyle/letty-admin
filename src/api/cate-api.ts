import axios from '@/api'

// 分类列表
export const getCateListApi = () => axios.get<null, BaseResponse<CateItem[]>>('/my/cate/list')

// 添加分类
export const postCateApi = (data: FormData) => axios.post<null, BaseResponse>('/my/cate/add', data)

// 修改分类
export const editCateApi = (data: FormData) => axios.put<null, BaseResponse>('/my/cate/info', data)

// 删除分类
// export const delCateApi = (id: string) => axios.delete<null, BaseResponse>('/my/cate/del', { params: { id } })
export const delCateApi = (data: FormData) => axios.delete<null, BaseResponse>('/my/cate/del', { params: data })
