// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from 'joi';

export const updateCartSchema = Joi.object({
  productId: Joi.string().required(),
  count: Joi.number().integer().min(0).strict()
    .required(),
});
