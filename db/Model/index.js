const mongoose = require('mongoose')
const { UserSchema, PostSchema, CommentSchema, TagSchema } = require('../Schema')

const UserModel = mongoose.model('User', UserSchema)
const PostModel = mongoose.model('Post', PostSchema)
const CommentModel = mongoose.model('Comment', CommentSchema)
const TagModel = mongoose.model('Tag', TagSchema)
module.exports = {
  UserModel,
  PostModel,
  CommentModel,
  TagModel
}
