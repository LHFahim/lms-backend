import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { JWTService } from 'libs/jwt/src';
import { InjectModel } from 'nestjs-typegoose';
import { SerializableService } from '../../interfaces/serializable.class';
import { UserDto } from '../../user/dto/user.dto';
import { AuthProvider, PanelType, UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthProfileDto, VerifyEmailDto } from './dto/auth-user.dto';
import {
    ChangeEmailSendCodeForNewEmailDto,
    ChangeEmailVerifyCodeDto,
    ChangeEmailVerifyCodeForNewEmailDto,
} from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto, ResetPasswordSendCodeDto, ResetPasswordVerifyCodeDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OTPEntity, OTPTypeEnum } from './entities/otp';

@Injectable()
export class AdminAuthService extends SerializableService<UserEntity> {
    constructor(
        private jwtService: JWTService,
        private userService: UserService,
        @InjectModel(OTPEntity)
        private readonly otpModel: ReturnModelType<typeof OTPEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
    ) {
        super(UserEntity);
    }

    private readonly THREE_MINUTE = 1000 * 60 * 3;

    async register(dto: RegisterDto) {
        const user = await this.userService.findByEmail(dto.email);

        if ((dto.authProvider === AuthProvider.FACEBOOK || dto.authProvider === AuthProvider.GOOGLE) && user)
            return this.getLoginResponse(user);

        if (user) throw new ConflictException('User already exists with this email');

        if (dto.password) dto.password = await this.getHashedPassword(dto.password);

        const newUser = await this.userService.create({
            ...dto,
            avatarURL: dto.avatarURL || '',

            panelType: PanelType.ADMIN,
            isActive: true,
            isDeleted: false,
            isEmailVerified: true, // if provider is email set to false later
        });

        return this.getLoginResponse(newUser);
    }

    async login({ email, password }: LoginDto) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        if (!(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid password');
        }

        return this.getLoginResponse(user);
    }

    private static async generateSalt() {
        return await bcrypt.genSalt(10);
    }

    async getLoginResponse(user: DocumentType<UserEntity>): Promise<AuthResponseDto> {
        const accessToken = await this.jwtService.signJWT({
            id: user._id,
            type: 'access_token',
        });
        const refreshToken = await this.jwtService.signJWT({
            id: user._id,
            type: 'refresh_token',
        });

        return {
            accessToken,
            refreshToken,
            user: this.toJSON(user, UserDto),
        };
    }

    public async refreshJwtToken(dto: RefreshTokenDto) {
        const refreshTokenData = await this.jwtService.verifyJWT(dto.refreshToken);

        if (refreshTokenData.type !== 'refresh_token') throw new BadRequestException('Invalid refresh token');

        const user = await this.userService.findByID(refreshTokenData.id);

        if (!user) throw new NotFoundException('User not found');

        return this.getLoginResponse(user);
    }

    private async getHashedPassword(password: string) {
        const salt = await AdminAuthService.generateSalt();
        return await bcrypt.hash(password, salt);
    }

    async getAuthUser(userId: string) {
        return this.userService.authUser(userId);
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Passwords does not match');

        const user = await this.userService.findByID(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Password change only allowed for register by email user');

        if (!bcrypt.compareSync(dto.oldPassword, user.password))
            throw new BadRequestException('Incorrect old password');

        user.password = await this.getHashedPassword(dto.newPassword);
        await user.save();

        return 'Password changed successful';
    }

    async resetPassword(dto: ResetPasswordDto) {
        if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Passwords does not match');

        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Reset password only works with email registration');

        const otp = await this.otpModel.findOneAndDelete({
            email: dto.email,
            type: OTPTypeEnum.RESET_PASS,
            isVerified: true,
        });
        if (!otp) throw new BadRequestException('Please verify password reset code first');

        user.password = await this.getHashedPassword(dto.newPassword);
        await user.save();

        return 'Password reset successful';
    }

    async resetPasswordSendCode(dto: ResetPasswordSendCodeDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Reset password only works with email registration');

        const token = AdminAuthService.generateToken();

        const otp = await this.otpModel.findOne({
            email: dto.email,
            type: OTPTypeEnum.RESET_PASS,
        });
        if (otp) {
            const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            otp.code = token;
            otp.createdAt = new Date();
            await otp.save({ timestamps: { createdAt: false } });
        } else {
            await this.otpModel.create({
                email: dto.email,
                code: token,
                isVerified: false,
                type: OTPTypeEnum.RESET_PASS,
            });
        }

        // await this.mailService.sendResetPasswordEmail(user.email, token);

        return 'OTP sent';
    }

    async resetPasswordVerifyCode(dto: ResetPasswordVerifyCodeDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');

        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Resend verification code only works with email registration');

        const otp = await this.otpModel.findOneAndUpdate(
            {
                email: dto.email,
                code: dto.code,
                type: OTPTypeEnum.RESET_PASS,
            },
            { isVerified: true },
        );
        if (!otp) throw new BadRequestException('Invalid password reset code');

        return 'OTP verified';
    }

    private static generateToken(length = 6) {
        const digits = '0123456789';
        let OTP = '';

        for (let i = 0; i < length; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        OTP = '1234';

        return OTP;
    }

    async changeEmailSendCode(userId: string) {
        const user = await this.userService.findByID(userId);
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Change email only works with email registration');

        const token = AdminAuthService.generateToken();

        const otp = await this.otpModel.findOne({
            email: user.email,
            type: OTPTypeEnum.EMAIL_CHANGE,
        });
        if (otp) {
            const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            otp.code = token;
            otp.createdAt = new Date();
            await otp.save({ timestamps: { createdAt: false } });
        } else {
            await this.otpModel.create({
                email: user.email,
                code: token,
                isVerified: false,
                type: OTPTypeEnum.EMAIL_CHANGE,
            });
        }

        // await this.mailService.sendEmailAddressChangeEmail(user.email, token);

        return 'OTP sent';
    }

    async changeEmailVerifyCode(userId: string, dto: ChangeEmailVerifyCodeDto) {
        const user = await this.userService.findByID(userId);
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Change email only works with email registration');

        const otp = await this.otpModel.findOneAndUpdate(
            {
                email: user.email,
                code: dto.code,
                type: OTPTypeEnum.EMAIL_CHANGE,
            },
            { isVerified: true },
        );
        if (!otp) throw new BadRequestException('Invalid email change code');

        return 'OTP verified';
    }

    async changeEmailSendCodeForNewEmail(userId: string, dto: ChangeEmailSendCodeForNewEmailDto) {
        const user = await this.userService.findByID(userId);
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Change email only works with email registration');

        const findExisting = await this.userService.findByEmail(dto.email);
        if (findExisting) throw new ConflictException('A user already exists with this email');

        const changeEmailOtp = await this.otpModel.findOneAndDelete({
            email: user.email,
            type: OTPTypeEnum.EMAIL_CHANGE,
            isVerified: true,
        });
        if (!changeEmailOtp) throw new BadRequestException('Please verify change email code first');

        const token = AdminAuthService.generateToken();

        const otp = await this.otpModel.findOne({
            email: dto.email,
            type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
        });
        if (otp) {
            const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            otp.code = token;
            otp.createdAt = new Date();
            await otp.save({ timestamps: { createdAt: false } });
        } else {
            await this.otpModel.create({
                email: dto.email,
                code: token,
                isVerified: false,
                type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
            });
        }

        // await this.mailService.sendVerificationEmail(dto.email, token);

        return 'OTP sent';
    }

    async changeEmailVerifyCodeForNewEmail(userId: string, dto: ChangeEmailVerifyCodeForNewEmailDto) {
        const user = await this.userService.findByID(userId);
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Change email only works with email registration');

        const otp = await this.otpModel.findOneAndUpdate(
            {
                email: dto.email,
                code: dto.code,
                type: OTPTypeEnum.EMAIL_CHANGE_VERIFY_EMAIL,
            },
            { isVerified: true },
        );
        if (!otp) throw new BadRequestException('Invalid email verify code');

        return 'OTP verified';
    }

    async getMyProfile(userId: string) {
        const user = await this.userService.findByID(userId);
        if (!user) throw new NotFoundException('User not found');

        return this.toJSON(user, AuthProfileDto);
    }

    async updateMyProfile(userId: string, body: UpdateProfileDto) {
        const user = await this.userService.update(userId, body);
        if (!user) throw new NotFoundException('User not found');

        return this.toJSON(user, AuthProfileDto);
    }

    async updateAvatar(userId: string, file: Express.Multer.File) {
        const user = await this.userService.updateAvatar(userId, file.buffer);
        return this.toJSON(user, AuthProfileDto);
    }

    async verifyEmail(dto: VerifyEmailDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');
        if (user.isEmailVerified) throw new BadRequestException('User already verified');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Email verification only works with email registration');

        const otp = await this.otpModel.findOneAndDelete({
            email: dto.email,
            code: dto.code,
            type: OTPTypeEnum.VERIFY_EMAIL,
        });
        if (!otp) throw new BadRequestException('Invalid email verification code');

        user.isEmailVerified = true;
        await user.save();

        return 'Email verified';
    }

    async sendVerificationEmail(userId: string) {
        const user = await this.userService.findByID(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.isEmailVerified) throw new BadRequestException('User already verified');
        if (user.authProvider !== AuthProvider.EMAIL)
            throw new BadRequestException('Resend verification code only works with email registration');

        const token = AdminAuthService.generateToken();

        const otp = await this.otpModel.findOne({ email: user.email, type: OTPTypeEnum.VERIFY_EMAIL });
        if (otp) {
            const needToWait = new Date(otp.createdAt as Date).getTime() + this.THREE_MINUTE > Date.now();
            if (needToWait) throw new BadRequestException('Please wait some time to resend code again');

            otp.code = token;
            otp.createdAt = new Date();
            await otp.save({ timestamps: { createdAt: false } });
        } else {
            await this.otpModel.create({
                email: user.email,
                code: token,
                type: OTPTypeEnum.VERIFY_EMAIL,
                isVerified: false,
            });
        }

        // await this.mailService.sendEmailVerifyEmail(user.email, token);

        return 'OTP sent';
    }

    async isAdmin(userId: string) {
        return await this.userModel.findOne({ _id: userId, panelType: PanelType.ADMIN });
    }
}
