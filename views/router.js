import Vue from 'vue'
import Router from 'vue-router'
import Posts from 'comps/Posts'
import Post from 'pages/Post'

const Index = () => import('pages/Index')
const Write = () => import('pages/Write')
const Login = () => import('pages/Login')
const Register = () => import('pages/Register')
// import Index from 'pages/Index'
// import Write from 'pages/Write'
// import Login from 'pages/Login'
// import Register from 'pages/Register'
Vue.use(Router)

export function createRouter () {
  const router = new Router({
    mode: 'history',
    routes: [
      { path: '/login', component: Login },
      { path: '/register', component: Register },
      {
        path: '/',
        component: Index,
        children: [
          { path: '/', component: Posts },
          { path: 'write', component: Write },
          { path: 'post/:id', component: Post }
        ]
      }
    ]
  })

  return router
}
