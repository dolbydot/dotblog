import * as t from 'types'
import { Login, Register, FetchTags, PublishPost, FetchPosts } from '@/api'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from 'config'
export default {
  // 为什么要写成这个格式，直接return Login(user)不可以？？
  [t.AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(t.AUTH_REQUEST)
      Login(user)
        .then(resp => {
          const cookies = new Cookies()
          const token = resp.token
          console.log('resp================================>', resp)
          console.log(config.storageNamespace)
          cookies.set(config.storageNamespace + 'token', resp.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 31
          })
          axios.defaults.headers['Authorization'] = 'Bearer ' + token
          commit(t.AUTH_SUCCESS, resp)
          commit(t.SET_USER, resp)
          resolve(resp)
        })
        .catch(err => {
          commit(t.AUTH_ERROR, err)
          localStorage.removeItem('token')
          reject(err)
        })
    })
  },
  [t.AUTH_LOGOUT]: ({commit, dispatch}) => new Promise((resolve, reject) => {
    commit(t.AUTH_LOGOUT)
    localStorage.removeItem('token')
    delete axios.defaults.headers['Authorization']
    resolve()
  }),
  [t.REGISTER]: ({commit, dispatch}, user) => new Promise((resolve, reject) => {
    Register(user).then(() => {
    }).catch(err => {
      commit(t.REGISTER_ERROR, err)
    })
  }),
  [t.FETCH_TAGS]: ({commit}) => new Promise((resolve, reject) => {
    FetchTags().then(tags => {
      commit(t.SET_TAGS, tags)
      resolve()
    })
  }),
  [t.PUBLISH_POST]: ({commit}, post) => new Promise((resolve, reject) => {
    PublishPost(post).then(res => {
      resolve()
    }).catch(reject)
  }),
  [t.FETCH_POSTS]: ({commit}) => new Promise((resolve, reject) => {
    return FetchPosts().then(posts => {
      commit(t.SET_POSTS, posts)
      resolve()
    }).catch(reject)
  })
}
