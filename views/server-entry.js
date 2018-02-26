import { createApp } from './createApp'

const isDev = process.env.NODE_ENV !== 'production'
let serverCookies

export { serverCookies }
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()

    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }
    serverCookies = context.cookies
    router.push(url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      console.log('MATHECD COMPONENTS===============>' + matchedComponents)
      // 如果刷新网页的话，这里没有成功匹配到components?
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
