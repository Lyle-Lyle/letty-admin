import axios from '@/api'

// 发布文章
export const postArticleApi = (data: FormData) => axios.post<null, BaseResponse>('/my/article/add', data)

// 根据分页，获取文章的列表数据
export const getArticleListApi = (data: ArtListQuery) => axios.get<null, ArticleListResponse>('/my/article/list', { params: data })

// 删除文章
export const deleteArticleApi = (data: FormData) => axios.delete<null, BaseResponse>('/my/article/info', { params: data })

// 根据 id 获取文章详情
export const getArticleApi = (id: string) => axios.get<null, BaseResponse<ArticleEditForm>>('/my/article/info', { params: { id } })

// 修改文章内容
export const putArticleApi = (data: FormData) => axios.put<null, BaseResponse>('/my/article/info', data)
