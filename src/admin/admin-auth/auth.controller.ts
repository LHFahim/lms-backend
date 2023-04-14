import { Serialize, UserId } from '@app/utils';
import { Body, Controller, Get, HttpCode, Patch, Post, Query, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImageFile } from 'libs/file-upload/src';
import { OAuthService } from 'libs/oauth/src';
import { APIVersions, ControllersEnum, Routes } from 'src/common';
import { AuthProvider } from '../../user/entities/user.entity';

import { AdminAuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { VerifyEmailDto } from './dto/auth-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto, ResetPasswordSendCodeDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Admin ===> auth')
@Serialize()
@Controller({ path: ControllersEnum.AdminAuth, version: APIVersions.V1 })
export class AdminAuthController {
    constructor(private readonly authService: AdminAuthService, private readonly oauthService: OAuthService) {}

    @Post(Routes[ControllersEnum.AdminAuth].register)
    async register(@Body() dto: RegisterDto) {
        return this.authService.register({ ...dto, authProvider: AuthProvider.EMAIL });
    }

    @ApiOkResponse({ type: AuthResponseDto })
    @ApiBody({ type: LoginDto })
    @HttpCode(200)
    @Post(Routes[ControllersEnum.AdminAuth].login)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post(Routes[ControllersEnum.AdminAuth].verifyEmail)
    async verifyEmail(@Query() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(Routes[ControllersEnum.AdminAuth].sendVerificationEmail)
    async sendVerificationEmail(@UserId() userId: string) {
        return this.authService.sendVerificationEmail(userId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(Routes[ControllersEnum.AdminAuth].myProfile)
    async getMyProfile(@UserId() userId: string) {
        return this.authService.getMyProfile(userId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(Routes[ControllersEnum.AdminAuth].myProfileUpdate)
    async updateMyProfile(@UserId() userId: string, @Body() body: UpdateProfileDto) {
        return this.authService.updateMyProfile(userId, body);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiImageFile({ fieldName: 'avatar', required: true }, { limits: { fileSize: 10 * 1024 * 1024, files: 1 } })
    @Post(Routes[ControllersEnum.AdminAuth].myProfileUpdateAvatar)
    updateAvatar(@UserId() userId: string, @UploadedFile() file: Express.Multer.File) {
        return this.authService.updateAvatar(userId, file);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(Routes[ControllersEnum.AdminAuth].changePassword)
    async changePassword(@UserId() userId: string, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(userId, dto);
    }

    @Patch(Routes[ControllersEnum.AdminAuth].resetPassword)
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body);
    }

    @Post(Routes[ControllersEnum.AdminAuth].resetPasswordSendCode)
    async resetPasswordSendCode(@Body() body: ResetPasswordSendCodeDto) {
        return this.authService.resetPasswordSendCode(body);
    }
}
