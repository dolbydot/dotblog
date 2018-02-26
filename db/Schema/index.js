const mongoose = require('mongoose')
const marked = require('marked')
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})
const conf = require('config')

const randomNum = (min, max) => {
  return () => ~~(Math.random() * (max - min)) + min
}
const UserSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
    unique: true
  },
  email: {
    type: 'string',
    required: true,
    unique: true
  },
  password: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'number',
    enum: [0, 1, 2],
    default: 0
  },
  bio: {
    type: 'string'
  }
})

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  up: {
    type: 'number',
    default: randomNum(1, 1000)
  },
  heart: {
    type: 'number',
    default: randomNum(1, 1000)
  },
  comments: {
    type: 'number',
    default: randomNum(1, 1000)
  },
  pv: {
    type: 'number',
    default: randomNum(1, 1000)
  },
  created: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }})
PostSchema.virtual('html').get(function () {
  return marked(this.content.split(conf.get('abstractSaparater')).join(''))
})
PostSchema.virtual('abstract').get(function () {
  return marked(this.content.split(conf.get('abstractSaparater'))[0])
})

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: 'string',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
})
CommentSchema.virtual('html').get(function () {
  return marked(this.content)
})

const TagSchema = new mongoose.Schema({
  tagName: {
    type: mongoose.Schema.Types.String,
    required: true
  }
})

module.exports = {
  UserSchema,
  PostSchema,
  CommentSchema,
  TagSchema
}
