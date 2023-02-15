import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JWTService } from 'libs/jwt/src';
import { AdminAuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JWTService, private authService: AdminAuthService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const token = req.headers.authorization;
        if (!token) throw new BadRequestException('Authorization Token is Required');

        const tokenSplit = token.split(' ').pop();
        if (!tokenSplit) throw new BadRequestException('Authorization Token is Required');

        const decoded = await this.jwtService.verifyJWT(tokenSplit);
        if (decoded.type !== 'access_token') throw new BadRequestException('Authorization Token is Required');

        req.user = await this.authService.getAuthUser(decoded.id);

        // for now omitting check for otps controller (added support for resend two step auth code)
        // Need to handle other way if needed

        return true;
    }
}
