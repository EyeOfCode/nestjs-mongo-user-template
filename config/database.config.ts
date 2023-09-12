import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { validationOptions } from './validation.options';

dotenv.config({ path: '.env' });

export interface responseConfig {
  uri: string;
  dbName: string;
  user: string;
  pass: string;
}

export interface DbConfig {
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
}

const SCHEMA = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().optional().allow(''),
  DB_PASS: Joi.string().optional().allow(''),
});

export default registerAs('db', async (): Promise<responseConfig> => {
  const env = await SCHEMA.validate(process.env);

  let value: DbConfig;
  try {
    value = await SCHEMA.validateAsync(env.value, validationOptions);
  } catch (error) {
    throw Error('ENV validation failed – DB: ' + error);
  }
  return {
    uri: value.DB_HOST,
    dbName: value.DB_NAME,
    user: value.DB_USER,
    pass: value.DB_PASS,
  };
});
