import localforage from 'localforage'

localforage.config({
  // 配置数据库的名称
  name: 'article-admin'
})

export default localforage
