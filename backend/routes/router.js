const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const authenticateMiddleware = require('../middleware/authenticate');

// user routes
router.get('/', userController.viewHome);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// post routes
router.get('/create-post', authenticateMiddleware.isLoggedIn, postController.viewPostForm);
router.post('/create-post', authenticateMiddleware.isLoggedIn, postController.create);

module.exports = router;
