const Comment = require("../models/Comment");
const Post = require("../models/Post");



const createComment = async (req, res) => {
    const {id: postId} = req.params;
    
    const comment = await Comment.create(req.body);

    // add comment to post comments
    await Post.findByIdAndUpdate(
        
    )
}