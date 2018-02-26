const {UserModel, PostModel, TagModel} = require('../Model')
module.exports = {
  async findUserById (id) {
    return UserModel.find({_id: id})
  },
  async getUserByName (name) {
    return UserModel.findOne({name}).lean()
  },
  async addNewUser (name, password, email) {
    return UserModel.create({name, password, email})
  },
  async newPost (post) {
    return PostModel.create(post)
  },
  async getPostList (skipIndex = 0, limit = 10) {
    // 降序排列
    return PostModel.find()
      .sort({created: -1})
      .populate({path: 'author', select: '_id name gender'})
      .populate('tags')
      .skip(skipIndex).limit(limit)
  },
  async getTags () {
    return TagModel.find()
  }
}
