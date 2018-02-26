const bodyParser = require('body-parser')

module.exports.bodyParser = bodyParser.urlencoded({ extended: false })
module.exports.jsonParser = bodyParser.json()
