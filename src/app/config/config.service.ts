import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as path from 'path';

/**
 * Environment configuration map
 *
 * @export
 * @interface EnvConfig
 */
export interface EnvConfig {
  [key: string]: string;
}

/**
 * Configuration service
 * Holds configuration values loaded from environment
 *
 * @export
 * @class ConfigService
 */
export class ConfigService {
  /**
   * Path to folder with env configurations
   *
   * @private
   * @type {string}
   * @memberof ConfigService
   */
  private readonly ENV_FOLDER: string = '../../environments/';

  /**
   * Environment configuration schema object
   *
   * @private
   * @type {Joi.ObjectSchema}
   * @memberof ConfigService
   */
  private readonly ENV_SCHEMA: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid(['development', 'production', 'test'])
      .default('development'),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().default('localhost'),
    DB_NAME: Joi.string().default('mann'),
  });

  /**
   * Configuration values map
   *
   * @private
   * @type {{ [key: string]: string }}
   * @memberof ConfigService
   */
  private readonly envConfig: EnvConfig;

  constructor() {
    // Load of environment configuration
    const config = dotenv.parse(fs.readFileSync(path.join(__dirname, this.ENV_FOLDER, `${process.env.NODE_ENV}.env`)));
    // Validation of configuration values
    this.envConfig = this.validateInput(config);
  }

  /**
   * Retrieves a configuration value from its key
   *
   * @param {string} key key of configuration value to retrieve
   * @returns {string} configuration value
   * @memberof ConfigService
   */
  public get(key: string): string {
    return this.envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   *
   * @private
   * @param {EnvConfig} envConfig loaded configuration from .env file
   * @returns {EnvConfig} validated configuration
   * @throws {Error} Config validation error: message
   * @memberof ConfigService
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, this.ENV_SCHEMA);
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validatedEnvConfig;
  }
}
