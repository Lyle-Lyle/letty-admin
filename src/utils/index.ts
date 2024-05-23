// 生成一个延时的异步操作，通过第一个参数，可以指定成功率，通过第二个参数，可以指定延迟的毫秒数
export const delay = (successRate: number = 50, ms: number = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100
      if (num < successRate) {
        // 成功了
        resolve(true)
      } else {
        // 失败了
        reject(new Error('Promise调用失败了！'))
      }
    }, ms)
  })
}
