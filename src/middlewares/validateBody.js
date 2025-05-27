export function validateBody (req, res, next) {
	console.log(req.body);
	next();
}