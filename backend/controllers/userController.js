const User = require('../models/Users');
const { getAvatarImg } = require('../util/avatar');

exports.viewHome = (req, res) => {
	if (req.session.user) {
		res.render('home-dashboard');
	} else {
		res.render('home-guest', {errors: req.flash('errors'), success: req.flash('success')});
	}
};

exports.register = async (req, res) => {
	let user = new User(req.body);

	user.register().then(result => {
		req.flash('success', [result]);

		req.session.save(() => {
			res.redirect('/');
		})
	}).catch(err => {
		req.flash('errors', user.errors);
		
		req.session.save(() => {
			res.redirect('/');
		})
	})
}

exports.login = async (req, res) => {
	let user = new User(req.body);

	user.login().then(loggedInUser => {
		const userAvatar = getAvatarImg(loggedInUser.email);

		req.session.user = { username: loggedInUser.username, avatar: userAvatar, _id: loggedInUser._id }
		req.session.save(() => {
			res.redirect('/');
		});
	}).catch(err => {
		req.flash('errors', err);

		req.session.save(() => {
			res.redirect('/');
		})
	})
}

exports.logout = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

