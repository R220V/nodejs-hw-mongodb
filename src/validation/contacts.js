import Joi from "joi";

 //Post/Put 
 export const createContactSchema = Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(13).required(),
	email: Joi.string().email().required(),
	isFavourite: Joi.boolean(),
	contactType: Joi.valid('work','home', 'personal'),
  photo: Joi.string().uri().optional().allow(null),
});


//Patch
export const updateContactSchema =Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(13),
	email: Joi.string().email(),
	isFavourite: Joi.boolean(),
	contactType: Joi.valid('work','home', 'personal'),
	photo: Joi.string().uri().optional().allow(null),
});