import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class JWTSettings {
  secret: string;
  expiresIn: string;
}

export class JWTPayload {
  id: string;
  type: 'access_token' | 'refresh_token' | 'forgot_password' | 'change_email';
}

@Injectable()
export class JWTService {
  constructor(private settings: JWTSettings) {}

  signJWT(payload: JWTPayload, options?: jwt.SignOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.settings.secret,
        {
          expiresIn: this.settings.expiresIn,
          ...options,
        },
        (err, token) => {
          if (err) {
            return reject(new InternalServerErrorException(err.message));
          }

          if (!token) {
            return reject(
              new InternalServerErrorException('Token is not generated'),
            );
          }

          resolve(token);
        },
      );
    });
  }

  verifyJWT(token: string): Promise<JWTPayload & jwt.JwtPayload> {
    return new Promise<JWTPayload & jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(token, this.settings.secret, (err, decoded) => {
        if (err) {
          return reject(new BadRequestException(err.message));
        }

        if (!decoded) {
          return reject(new BadRequestException('Token is not verified'));
        }

        resolve(decoded as JWTPayload & jwt.JwtPayload);
      });
    });
  }
}
