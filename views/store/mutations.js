import * as t from 'types'
export default {
  [t.AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [t.AUTH_SUCCESS]: (state, res) => {
    state.status = 'success'
  },
  [t.AUTH_ERROR]: state => {
    state.status = 'error'
  },
  [t.SET_TAGS]: (state, tags) => {
    state.tags = tags
  },
  [t.SET_POSTS]: (state, posts) => {
    state.posts = posts
  },
  [t.SET_USER]: (state, user) => {
    state.user = user
  }
}
