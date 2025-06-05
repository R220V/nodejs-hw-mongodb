import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";


export function isValidID(req, res, next) {
	// if (!isValidObjectId(req.params.contactId)) {
	if (isValidObjectId(req.params.contactId)!==true) {
		return next(createHttpError.BadRequest('Id should be an ObjectId'));
	}
	next();
};