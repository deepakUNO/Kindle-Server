import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request & { user?: any }>();
        const headerAuth = req.headers['authorization'] as string | undefined;
        const token = headerAuth ? headerAuth.split(' ')[1] : (req.cookies?.authToken as string | undefined);
        if (!token) throw new UnauthorizedException('No auth token');
        try {
            const user = await this.userService.validateAuthToken(token);
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException(e.message || 'Invalid token');
        }
    }
}
