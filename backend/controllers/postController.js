const Post = require('../models/Posts');

exports.viewPostForm = (req, res) => {
    res.render('create-post');
}
exports.create = (req, res) => {
    console.log('inside post form');
    const post = new Post(req.body);

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
