import Joi from "joi";
//виправити

 //Post/Put 
 export const createContactSchema = Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(13).required(),
	email: Joi.string().required(),
	isFavourite: Joi.boolean(),
	contactType: Joi.valid('work','home', 'personal'),
});

createContactSchema.validateAsync()

//Patch
export const updateContactSchema =Joi.object({
	name: Joi.string().min(3).max(20).required(),
	phoneNumber: Joi.string().min(3).max(13),
	email: Joi.string(),
	isFavourite: Joi.boolean(),
	contactType: Joi.valid('work','home', 'personal'),
});