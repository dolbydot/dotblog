const expresss = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = expresss.Router()
const {jsonParser} = require('../middlewares/')
const db = require('../db')
const {asyncHandler, bCompare, bhash} = require('../utils/')
router.get('/user', (q, s) => {
  s.set('content-type', 'application/json')
  s.json({
    name: 'dolb'
  })
})
router.post('/user/login', jsonParser, asyncHandler(async (q, s, n) => {
  const { username, password } = q.body
  let curUser = await db.getUserByName(username)
  if (!curUser) throw {errno: 10001, errmsg: 'USER_NOT_FOUND'}
  const isPasswordMatch = bCompare(password, curUser.password)
  if (!isPasswordMatch) throw {errno: 10001, errmsg: 'USER_PASSPWD_NOT_MATCH'}
  const token = jwt.sign({id: curUser._id}, config.get('jwt.secret'), { expiresIn: config.get('jwt.expire') })
  curUser.token = token
  s.json(curUser)
}))

router.post('/user/new', jsonParser, asyncHandler(async (q, s) => {
  const {username, password, email} = q.body
  const res = await db.addNewUser(username, bhash(password), email)
  s.json(res)
}))

router.get('/post/list', asyncHandler(async (q, s) => {
  const {skipIndex, limit} = q.query
  const res = await db.getPostList(parseInt(skipIndex), parseInt(limit))
  s.json(res)
}))
router.post('/post/new', jsonParser, asyncHandler(async (q, s) => {
  const post = q.body
  const res = await db.newPost(post)
  s.json(res)
}))
router.get('/tag/list', asyncHandler(async (q, s) => {
  const res = await db.getTags()
  s.json(res)
}))
module.exports = router
