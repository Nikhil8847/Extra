const User = require("../../models/User");

const deleteUserFromDB = async (_id) => {
    const user = await User.findById({_id: _id})
  const posts = await Post.deleteMany({author: _id});
  const comment = await Comment.deleteMany({user: _id})
  const category = await Category.deleteMany({user: _id})
  user.delete();


}

module.exports = deleteUserFromDB