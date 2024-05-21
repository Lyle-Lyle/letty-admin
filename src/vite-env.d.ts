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

type UserInfoForm = Pick<User, 'id' | 'email' | 'nickname'>;

type ResetPwdForm = {
  old_pwd: string;
  new_pwd: string;
  re_pwd: string;
};

type CateItem = {
  readonly id: number;
  cate_name: string;
  cate_alias: string;
};

type ArtCateAddForm = Omit<CateItem, 'id'>;

type ArticleAddForm = {
  title: string;
  cate_id: string;
  content: string;
  state: '草稿' | '已发布';
  cover_img: Blob;
  [x: string]: string | Blob;
};
type ArticleEditForm = ArticleAddForm & { readonly id: string };

type ArticleAddBaseForm = Partial<Pick<ArticleAddForm, 'title' | 'cate_id'>>;
type ArticleEditBaseForm = ArticleAddBaseForm;

type ArtListQuery = {
  pagenum: number;
  pagesize: number;
  cate_id: number | string;
  state: string;
};

// 文章的类型
type Article = {
  readonly id: number;
  title: string;
  pub_date: string;
  state: '草稿' | '已发布';
  cate_name: string;
};

// 文章列表接口返回的数据类型
interface ArticleListResponse extends BaseResponse<Article[]> {
  total: number;
}
