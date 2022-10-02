import joi from "joi";

const customerSchema = joi.object({
	name: joi.string().required().trim(),
	phone: joi
		.string()
		.required()
		.trim()
		.min(10)
		.max(11)
		.pattern(/^[0-9]+$/),
	cpf: joi
		.string()
		.required()
		.trim()
		.length(11)
		.pattern(/^[0-9]+$/),
	birthday: joi.string().required().trim().isoDate(),
});

export default customerSchema;
