export default (app) => {
	app
		.get('/session/new', (req, reply) => {
			const signInForm = {};
			reply.render('session/new', { signInForm });
		});
};