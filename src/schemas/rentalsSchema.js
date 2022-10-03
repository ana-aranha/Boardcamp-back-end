import joi from "joi";

const rentalSchema = joi.object({
	customerId: joi.number().required().min(1).integer(),
	gameId: joi.number().required().min(1).integer(),
	daysRented: joi.number().required().min(1).integer(),
});

export default rentalSchema;
