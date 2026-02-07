Promise.retry = async function(fun, times = 3, delay = 1000) {
  let attTimes = 0 // 当前重试次数
  
  while (attTimes < times) {
    try {
      attTimes++
      console.log(`第 ${attTimes} 次尝试`)
      const res = await fun()
      return res // 成功则直接返回
    } catch (e) {
      if (attTimes >= times) {
        throw e // 达到最大重试次数，抛出错误
      }
      // 等待延迟后重试
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

function testRetry() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('retry failed')
        }, 1000)
    })
}

Promise.retry(testRetry, 3, 1000)
  .then(res => console.log(res))
  .catch(err => console.error(err))