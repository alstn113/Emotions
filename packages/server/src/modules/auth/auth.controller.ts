import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { GetCurrentUser, Public, CurrentUser } from '../../common/decorators';
import { GithubGuard } from '../../common/guards';
import { clearTokenCookie, setTokenCookie } from '../../lib/cookies';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubGuard)
  loginWithGithub(): string {
    return 'login with github';
  }

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubCallback(
    @Res() res: Response,
    @GetCurrentUser() user: CurrentUser,
  ): Promise<void> {
    const FRONTEND_URL = this.configService.get<string>('FRONTEND_URL');
    const token = await this.authService.generateToken({
      userId: user.userId,
      username: user.username,
      role: user.role,
    });
    setTokenCookie(res, token);
    return res.redirect(`${FRONTEND_URL}`);
  }

  @Delete('logout')
  logout(@Res() res: Response) {
    clearTokenCookie(res);
    return res.status(200).json({ message: 'Logout success' });
  }
}
