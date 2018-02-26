## 1. 定义目录结构
`tree -C --dirsfirst`

```
├── build               // 构建脚本
├── config              // 配置文件
│   └── default.json
├── controllers         // MVC
├── db                  // 操作数据库
│   ├── Model           // Model
│   ├── Schema
│   └── index.js        // 入口
├── middlewares         // 通用中间件
├── public              // public资源
├── utils               // 工具类
├── views               // client端代码
│   ├── api
│   ├── components
│   ├── mixins
│   ├── pages
│   ├── store
│   ├── styles
│   ├── client-entry.js
│   ├── createApp.js
│   ├── index.html
│   ├── router.js
│   └── server-entry.js
├── README.md
├── app.js               // 入口
└── package.json         //
```

## 2. 开发工具准备

echo "node_modules" > .gitignore

echo "registry=https://registry.npm.taobao.org" > .npmrc

### 2.1 开启eslint fix on save
cmd+shift+p  ==> workspace settings
``` js
{
  "eslint.autoFixOnSave": true
}
```
### 2.2 安装eslint相关组件
```bash
npm i -D eslint eslint-loader \
         eslint-config-standard \
         eslint-plugin-html \
         eslint-plugin-import \
         eslint-plugin-node \
         eslint-plugin-promise \
         eslint-plugin-standard
```
### 2.3 配置eslint
```js
// .eslintrc
// https://eslint.org/docs/rules/
{
  "root": true,
  "extends": "standard",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jest": true,
    "node": true
  },
  "plugins": [
    "html"
  ]
}
```
在npm scripts中添加:
```js
"lint": "eslint . --ext .vue,.js"
```


## 3. DB处理

### 3.1 安装依赖

安装依赖

```
npm i -S marked mongoose config
```
### 3.2 连接数据库

```js
//db/index.js
const mongoose = require('mongoose')
// 读取config/default.json配置
const conf = require('config')

mongoose.Promise = global.Promise
mongoose.connect(conf.get('db'), {
  poolSize: 20
}).then(() => {
  console.log('db connected!!')
}).catch(e => {
  console.error('db connect failed')
  process.exit(1)
})
// 抛出Query下的函数
module.exports = require('./Query')

```

### 3.3 编写Schema以及Model
```js
// db/Schema/index.js
const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  avatar: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: 'string',
    required: true
  }
})
module.exports = {
  UserSchema,
  //...其他Schema
}

// db/Model/index.js
const mongoose = require('mongoose')
const { UserSchema, PostSchema, CommentSchema } = require('../Schema/')

const UserModel = mongoose.model('User', UserSchema)
const PostModel = mongoose.model('Post', PostSchema)
const CommentModel = mongoose.model('Comment', CommentSchema)

module.exports = {
  UserModel,
  PostModel,
  CommentModel
}
```
### 3.4 编写常用的Query代码(可选,只抛出model类也可以)
```js
// db/Query/index.js
const {UserModel} = require('../Model')
module.exports = {
  async findUserById (id) {
    return UserModel.find({_id: id})
  }
}
```


## 4. 启动后端API服务
### 4.1 安装依赖，搭建基本结构

```
http://expressjs.com/
http://expressjs.com/en/resources/middleware.html
https://npm.taobao.org/package/express-session
http://expressjs.com/en/resources/middleware/errorhandler.html
https://www.tianmaying.com/tutorial/cookie-session
```

```bash
npm i -S express \
         express-session \
         cors \
         morgan \
         node-uuid \
         rotating-file-stream \
         errorhandler \
         serve-favicon \
         connect-mongo \
         body-parser \
         helmet \
         express-jwt \
```
编写app.js入口

```js
// app.js
const express = require('express')
const uuid = require('node-uuid')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const fs = require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')
const config = require('config')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const api = require('./controllers/api')
const log = console.log
const err = console.error
// favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// helmet
app.use(require('helmet')())

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
  return req.id
})
app.use(morgan(':id :date :method :url :status :response-time :res[content-type] :res[content-length] :user-agent', {stream: accessLogStream}))

// session
// http://expressjs.com/en/resources/middleware/session.html
app.set('trust proxy', 1) // https流量走nginx代理需要配置
app.use(session({
  name: config.get('session.key'), //
  secret: config.get('session.secret'), //
  resave: true, //
  saveUninitialized: false, //
  cookie: {
    secure: true,
    maxAge: config.get('session.maxAge')//
  },
  store: new MongoStore({
    url: config.get('db')
  })
}))

app.use('/api', api)
app.use(express.static(path.resolve(__dirname, './public/')))

app.listen(config.get('port'), e => {
  if (e) {
    err(e)
    process.exit(1)
  }
  log(`server listening at port ${config.get('port')}`)
})

```
编写API路由
```js
// controllers/api.js
const expresss = require('express')
const router = expresss.Router()

router.get('/user', (q, s) => {
  s.json({
    name: 'dolb'
  })
})
module.exports = router
```
node app.js 后 查看服务是否正常
curl http://localhost:8888/api/user



### 4.2 切换登录方式为jwt
[session vs token](http://codelife.me/blog/2014/03/26/token-based-authentication-and-claims-based-identity/)
[vue auth](https://blog.sqreen.io/authentication-best-practices-vue/?utm_campaign=Revue%20newsletter&utm_medium=Newsletter&utm_source=Vue.js%20Developers)

#### 4.2.1 安装依赖
```js
npm i -S jsonwebtoken \
         express-jwt
```

#### 4.2.2 在app入口里更新jwt
```js
// app.js
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
app.use(jwt({
  secret: config.get('jwt.secret')
}).unless({custom: q => true}))
```
#### 4.2.3 编写服务端登录时下发token的逻辑
```js
router.post('/user/login', bodyParser, asyncHandler(async (q, s, n) => {
  const { username, password } = q.body
  const user = await db.getUserByName(username)
  let curUser = user[0]  //TODO 用户名唯一化处理,处理数组格式
  if (!curUser) throw {errno: 10001, errmsg: 'USER_NOT_FOUND'}
  const isPasswordMatch = bCompare(password, curUser.password)
  if (!isPasswordMatch) throw {errno: 10001, errmsg: 'USER_PASSPWD_NOT_MATCH'}
  const token = jwt.sign({id: curUser._id}, config.get('jwt.secret'), { expiresIn: config.get('jwt.expire') })
  s.json({user: curUser, token})
}))
```

#### 4.2.4 客户端登录获取token逻辑
客户端代码暂未处理，之后加上SSR后处理此处逻辑

## 5 SSR服务端渲染
[参考](https://ssr.vuejs.org/zh/)

### 5.1 安装依赖
```bash
npm i -S lru-cache \
         universal-cookie \
         vue-server-renderer \
         memory-fs \

npm i -D webpack \
         extract-text-webpack-plugin \
         friendly-errors-webpack-plugin \
         webpack-dev-middleware\
         webpack-hot-middleware \
         webpack-merge \
         webpack-node-externals \
         autoprefixer \
         babel-loader \
         vue-loader \
         vue-style-loader \
         stylus \
         stylus-loader \
         css-loader \
         rimraf
```
添加构建脚本

```js
  "build": "rimraf dist && npm run build:client && npm run build:server",
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js --progress --hide-modules",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js --progress --hide-modules"
```

#### 5.1.1 编写renderer中间件(app参数传入中间件供setup-dev-server，返回中间件)
```js

```

#### 5.1.2 编写客户端脚本

配置 babel

```bash
npm i -D babel-core \
         babel-preset-env \
         babel-plugin-syntax-dynamic-import
```

```js
//.babelrc
{
  "presets": [
    ["env", { "modules": false }]
  ],
  "plugins": [
    "syntax-dynamic-import"
  ]
}
```
安装vue相关组件
```
npm i -S vue \
         vue-router \
         es6-promise \
         vuex \
         axios \
         vuex-router-sync \
         vue-template-compiler \
         vue-localstorage
```

## 6 构建及发布


