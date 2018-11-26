import { INestApplication, Injectable } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { ConfigService } from '../config/config.service';

@Injectable()
export class SecurityService {
  constructor(private configService: ConfigService) {}

  /**
   * Initializes all security middlewares
   *
   * @param {INestApplication} app
   * @memberof SecurityService
   */
  public initialize(app: INestApplication) {
    // Use cookie parser for csurf
    app.use(cookieParser());
    // Sets several security headers
    app.use(helmet());
    // Adds CSRF token to requests
    app.use(csurf({ cookie: true }));
    // CORS configuration
    app.enableCors({
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        // Origins init
        const whitelistOrigins = this.configService.get('CORS_ALLOWED_ORIGINS');
        // If no white list origins, authorized
        if (whitelistOrigins.length === 0) return callback(null, true);
        // If request origin is in white list origin, authorized
        if (whitelistOrigins.indexOf(origin) !== -1) return callback(null, true);
        // Unauthorized origin
        return callback(new Error('Not allowed by CORS'));
      },
      methods: this.configService.get('CORS_ALLOWED_METHODS'),
      allowedHeaders: this.configService.get('CORS_ALLOWED_HEADERS'),
      exposedHeaders: this.configService.get('CORS_EXPOSED_METHODS'),
      credentials: this.configService.get('CORS_CREDENTIALS'),
      maxAge: this.configService.get('CORS_MAX_AGE'),
      preflightContinue: this.configService.get('CORS_PREFLIGHT_CONTINUE'),
      optionsSuccessStatus: this.configService.get('CORS_OPTIONS_SUCCESSS_CODE'),
    });
  }
}
