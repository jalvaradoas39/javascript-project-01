const User = require('../models/User');

exports.home = (req, res) => {
	res.render('home-guest');
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
		res.send(result);
	});
};
