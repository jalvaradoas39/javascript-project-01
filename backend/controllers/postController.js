const Post = require('../models/Posts');

exports.viewPostForm = (req, res) => {
    res.render('create-post');
}
exports.create = (req, res) => {
    const post = new Post(req.body, req.session.user._id);

    post.create().then(result => {
        res.json({
            successMsg: 'You post was created'
        })
    }).catch(err => {
        res.json({
            errorMsg: err
        })
    })
}
