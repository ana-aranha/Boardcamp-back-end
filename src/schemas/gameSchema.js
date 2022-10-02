import joi from "joi";

const gameSchema = joi.object({
	name: joi.string().required().trim(),
	image: joi
		.string()
		.uri()
		.required()
		.trim()
		.pattern(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/),
	stockTotal: joi.number().min(1).required(),
	categoryId: joi.number().required(),
	pricePerDay: joi.number().min(1).required(),
});

export default gameSchema;
