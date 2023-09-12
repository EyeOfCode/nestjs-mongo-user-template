import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { validationOptions } from './validation.options';

dotenv.config({ path: '.env' });

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  CLIENT_HOST: string;
}

const SCHEMA = Joi.object({
  NODE_ENV: Joi.string().valid(
    ...['development', 'production', 'staging', 'test'],
  ),
  PORT: Joi.number().default(8000),
  CLIENT_HOST: Joi.string(),
});

export default registerAs('app', async (): Promise<AppConfig> => {
  const env = await SCHEMA.validate(process.env);

  let value: AppConfig;
  try {
    value = await SCHEMA.validateAsync(env, validationOptions);
  } catch (error) {
    throw Error('ENV validation failed – APP: ' + error.errors);
  }
  return value;
});
