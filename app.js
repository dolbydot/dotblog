const express = require('express')
const uuid = require('node-uuid')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const fs = require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')
const config = require('config')
const jwt = require('express-jwt')
// const errorhandler = require('errorhandler')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const api = require('./controllers/api')
const log = console.log
const err = console.error

const app = express()

// favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

// 生成requestid
app.use((q, s, n) => {
  q.rid = uuid.v4()
  n()
})

// 日志处理
// http://expressjs.com/en/resources/middleware/morgan.html
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
})
morgan.token('id', function getId (req) {
  return req.rid
})
app.use(morgan(':id :date(iso) :method :url HTTP:/http-version :status :response-time ms :res[content-type] :res[content-length] :user-agent', {stream: accessLogStream}))

// session 基于cookie的session登录方式
// http://expressjs.com/en/resources/middleware/session.html
// app.set('trust proxy', 1) // https流量走nginx代理需要配置
// app.use(session({
//   name: config.get('session.key'), //
//   secret: config.get('session.secret'), //
//   resave: true, //
//   saveUninitialized: false, //
//   cookie: {
//     secure: true,
//     maxAge: config.get('session.maxAge')//
//   },
//   store: new MongoStore({
//     url: config.get('db')
//   })
// }))

// jwt token模式保存回话
// https://github.com/auth0/express-jwt
// https://github.com/jfromaniello/express-unless#current-options
// 页面不验证，只验证API即可，数据都是来源于后端,稍后修改
app.use(jwt({
  secret: config.get('jwt.secret')
}).unless({custom: q => {
  // true是不需要验证，false是需要
  // if (q.path === '/login') return true
  // if (/api/.test(q.path)) return true
  // if (/dist/.test(q.path)) return true
  // if (/__/.test(q.path)) return true
  return true
}}))

// api接口
app.use('/api', api)

// public目录静态资源
app.use(express.static(path.resolve(__dirname, './public/')))

// 渲染页中间件
app.use(require('./middlewares/renderer')(app))

// err handler
app.use((err, req, res, n) => {
  if (err.status === 401) {
    res.redirect('/login')
  }
})

app.listen(config.get('port'), e => {
  if (e) {
    err(e)
    process.exit(1)
  }
  log(`server listening at port ${config.get('port')}`)
})
