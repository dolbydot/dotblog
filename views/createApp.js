import Vue from 'vue'
import App from './components/App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import VueLocalStorage from 'vue-ls'
import config from 'config'

import './styles/common.css'
if (typeof window !== 'undefined') {
  Vue.use(require('vue-shortkey'))
}
Vue.use(VueLocalStorage, { namespace: config.storageNamespace })
// import titleMixin from './util/title'
// import * as filters from './util/filters'

// 设置title的mixin
// Vue.mixin(titleMixin)

// 注册全局filters
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })
// app instances on each call (which is called for each SSR request)
export function createApp () {
  const store = createStore()
  const router = createRouter()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
