// const User = require('../models/User');
const User = require('../models/Users');

exports.home = (req, res) => {
	if (req.session.user) {
		res.render('home-dashboard', { username: req.session.user.username });
	} else {
		res.render('home-guest');
	}
};

exports.register = (req, res) => {
	let user = new User(req.body);

	user.register(result => {
		res.send(result);
	});
};

exports.login = (req, res) => {
	const user = new User(req.body);

	user.login(result => {
		// add session data
		req.session.user = { username: user.data.username };
		req.session.save(() => {
			res.redirect('/');
		});
	});
};

exports.logout = (req, res) => {
	console.log('Inside logout controller');

	req.session.destroy(err => {
		if (err) console.log(err);

		console.log('Inside callback');
		res.redirect('/');
	});
};
