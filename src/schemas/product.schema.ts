import Joi from 'joi';

export const updateCartSchema = Joi.object({
  productId: Joi.string().required(),
  count: Joi.number().integer().required(),
});
