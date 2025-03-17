import {
  Controller,
  Post,
  Body,
  Param,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthUserDto } from '../users/dto/auth-user.dto';
import { Public } from 'src/casl/casl-ability.factory/policies.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return {
      message:
        'Usuário cadastrado com sucesso. Por favor, verifique seu email para ativar sua conta.',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    return this.authService.login(user);
  }

  @Public()
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    await this.authService.activateAccount(token);
    return {
      message: 'Conta ativada com sucesso. Você pode fazer login agora.',
    };
  }

  @Public()
  @Post('reset-password-request')
  async requestPasswordReset(@Body('email') email: string) {
    await this.authService.sendPasswordResetEmail(email);
    return { message: 'Email de redefinição de senha enviado com sucesso.' };
  }

  @Public()
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body()
    resetPasswordDto: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    await this.authService.resetPassword(
      token,
      resetPasswordDto.oldPassword,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );
    return { message: 'Senha atualizada com sucesso.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}