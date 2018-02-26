import axios from 'axios'
import Cookies from 'universal-cookie'
import conf from 'config'
import { serverCookies } from '../server-entry'

const baseUrl = 'http://localhost:9999'

const cookies = new Cookies()
const isClient = process.env.VUE_ENV === 'client'
axios.defaults.timeout = 3000
axios.interceptors.request.use((config) => {
  console.log('VUE-ENV', process.env.VUE_ENV)
  console.log('REQUESTING=======================================>', config.headers)
  let token
  if (isClient) {
    // loading.start()
    token = cookies.get(conf.storageNamespace + 'token')
  } else {
    token = serverCookies.get(conf.storageNamespace + 'token')
  }
  console.log('AXIOS REQUEST TOKEN ==================================>' + token)
  config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

axios.interceptors.response.use(res => {
  console.log('VUE-ENV', process.env.VUE_ENV)
  const data = res.data
  console.log('RESPONSE DAT===================', data)
  if (!data) {
    return {
      errno: 122,
      errmsg: 'something is wrong'
    }
  }
  // 总报cannot read property 'errno' of undefined why?
  if (data.errno) {
    throw {
      errno: parseInt(data.errno),
      errmsg: data.errmsg
    }
  }
  return res
}, error => {
  console.trace(error)
  // console.log('ERROR RESPONSE=============================>' + error.response.toString().substring(0, 30))
  throw error
})

export const Login = user => axios({ url: baseUrl + '/api/user/login', data: user, method: 'POST' })
export const Register = user => axios({url: baseUrl + '/api/user/new', data: user, method: 'POST'})
export const FetchTags = () => axios({url: baseUrl + '/api/tag/list?timestamp=' + Date.now(), method: 'GET'})
export const PublishPost = post => axios({url: '/api/post/new', data: post, method: 'POST'})
export const FetchPosts = () => axios({url: baseUrl + '/api/post/list', method: 'GET'})
export const GetPostById = id => axios({url: '/api/post/get', method: 'GET'})
