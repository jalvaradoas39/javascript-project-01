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
		req.session.user = { favColor: 'blue', username: user.data.username };
		res.send(result);
	});
};
