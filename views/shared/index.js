import axios from 'axios'
export const Login = user => new Promise((resolve, reject) => {
  axios({ url: '/api/user/login', data: user, method: 'POST' })
    .then(resp => {
      const token = resp.data.token
      localStorage.setItem('token', token)
      resolve(resp)
    })
    .catch(err => {
      localStorage.removeItem('token')
      reject(err)
    })
})
