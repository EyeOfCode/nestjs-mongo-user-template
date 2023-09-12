import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { validationOptions } from './validation.options';

dotenv.config({ path: '.env' });

export interface ThrottlerConfig {
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
}

const SCHEMA = Joi.object({
  THROTTLE_TTL: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),
});

export default registerAs('throttler', async (): Promise<ThrottlerConfig> => {
  const env = await SCHEMA.validate(process.env);

  let value: ThrottlerConfig;
  try {
    value = await SCHEMA.validateAsync(env.value, validationOptions);
  } catch (error) {
    throw Error('ENV validation failed – Throttler: ' + error.errors);
  }
  return value;
});
