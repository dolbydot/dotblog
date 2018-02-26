const bcyrpt = require('bcryptjs')

const codeMap = {
  '-1': 'fail',
  '0': 'success',
  '401': 'token expired',
  '500': 'server error',
  '10001': 'params error',
  '11000': '键名重复'
}

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const asyncHandler = fn => (q, s, n) => Promise.resolve(fn(q, s, n))
  .catch(e => {
    console.trace(e)
    s.json(fail(e.code))
  })

const bhash = str => bcyrpt.hashSync(str, 8)

const bCompare = (str, hash) => bcyrpt.compareSync(str, hash)

const success = data => ({
  code: 200,
  success: true,
  message: codeMap['200'],
  data: data || null
})
const fail = (code, msg, data) => ({
  errno: code || -1,
  errmsg: msg || codeMap[code]
})
module.exports = {
  asyncHandler,
  bhash,
  bCompare,
  success,
  fail
}
