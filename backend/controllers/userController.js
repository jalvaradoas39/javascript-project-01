exports.home = (req, res) => {
	res.render('home-guest');
};

exports.register = (req, res) => {
	console.log('Inside userController');
	res.send('Thanks for registering');
};
