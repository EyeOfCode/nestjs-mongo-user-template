import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { validationOptions } from './validation.options';

dotenv.config({ path: '.env' });

export interface AuthConfig {
  JWT_SECRET_WEB_KEY: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;
  JWT_EXPIRES_REMEMBER_IN: string;
  SALT_ROUND: number;
}

const SCHEMA = Joi.object({
  JWT_SECRET_WEB_KEY: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_EXPIRES_REMEMBER_IN: Joi.string().default('3d'),
  SALT_ROUND: Joi.number().default(8),
});

export default registerAs('auth', async (): Promise<AuthConfig> => {
  const env = await SCHEMA.validate(process.env);

  let value: AuthConfig;
  try {
    value = await SCHEMA.validateAsync(env.value, validationOptions);
  } catch (error) {
    throw Error('ENV validation failed – AUTH: ' + error.errors);
  }
  return value;
});
