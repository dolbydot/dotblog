const mongoose = require('mongoose')
// 读取config/default.json配置
const conf = require('config')

mongoose.Promise = global.Promise
mongoose.connect(conf.get('db'), {
  poolSize: 20,
  keepAlive: 120
}).then(() => {
  console.log('db connected!!')
}).catch(e => {
  console.error('db connect failed')
  console.error(e)
  process.exit(1)
})

module.exports = require('./Query')
module.exports.model = require('./Model/')
