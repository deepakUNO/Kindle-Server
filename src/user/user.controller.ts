import { Body, Controller, Post, Res, HttpStatus, Get, Headers, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import type { Response } from 'express';
import { loginUserDto } from './dto/loginUser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User created' })
    async register(@Body() user: any, @Res({ passthrough: true }) res: Response): Promise<User> {
        const created = await this.userService.register(user);
        // set HTTP-only cookie with the auth token and expiry matching JWT
        const jwtExpires = process.env.JWT_EXPIRES_IN ?? '1h';
        const parseExpirySeconds = (s: string) => {
            // support formats like '1h', '30m', '60s' or plain seconds
            const m = s.match(/^(\d+)([smh])?$/);
            if (!m) return 3600;
            const val = Number(m[1]);
            const unit = m[2] ?? 's';
            if (unit === 'h') return val * 3600;
            if (unit === 'm') return val * 60;
            return val;
        };
        const maxAgeMs = parseExpirySeconds(jwtExpires) * 1000;
        res.cookie('authToken', created.authToken, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax', maxAge: maxAgeMs });
        return created;
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User logged in' })
    async login(@Body() user: loginUserDto, @Res({ passthrough: true }) res: Response): Promise<User> {
        const existing = await this.userService.signIn(user);
        const jwtExpires = process.env.JWT_EXPIRES_IN ?? '1d';
        const parseExpirySeconds = (s: string) => {
            const m = s.match(/^(\d+)([smh])?$/);
            if (!m) return 3600;
            const val = Number(m[1]);
            const unit = m[2] ?? 's';
            if (unit === 'h') return val * 3600;
            if (unit === 'm') return val * 60;
            return val;
        };
        const maxAgeMs = parseExpirySeconds(jwtExpires) * 1000;
        res.cookie('authToken', existing.authToken, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax', maxAge: maxAgeMs });
        return existing;
    }

    @Get('myProfile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my profile' })
    async myProfile(@CurrentUser() user: User): Promise<User | null> {
        return user;
    }
}