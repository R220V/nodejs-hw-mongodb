import createHttpError from "http-errors";

export function validateBody (schema) {
return async (req, res, next) => {
	
	try {
		await schema.validateAsync(req.body, {abortEarly: false});//показуються всі помилки нащої схеми
		next()
	
	} catch (error) {
		const errors = error.details.map(detail => detail.message);
			console.error(error);
		next(createHttpError.BadRequest(errors.join(', ')))
	};
};
};