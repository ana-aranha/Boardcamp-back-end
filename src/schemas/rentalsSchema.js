import joi from "joi";

const rentalSchema = joi.object({
	customerId: joi.number().required().trim(),
	gameId: joi.number().required().trim(),
	daysRented: joi.number().required().trim(),
});

export default rentalSchema;
