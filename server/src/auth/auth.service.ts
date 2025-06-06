import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { MailerService } from '../mailer/mailer.service';
import { EmailTemplatesService } from 'src/email-templates/email-templates.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private emailTemplatesService: EmailTemplatesService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Sua conta não foi ativada.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      await this.usersService.update(
        user.id,
        {
          failedLoginAttempts: user.failedLoginAttempts,
        },
        user,
      );
      return null;
    }

    await this.usersService.update(user.id, { lastLogin: new Date() }, user);

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User) {
    const userWithRoles = await this.usersService.findOne(user.id, user);

    const payload: IJwtPayload = {
      sub: userWithRoles.id,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map((role) => role.name),
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: {
        id: userWithRoles.id,
        email: userWithRoles.email,
        roles: userWithRoles.roles,
      },
    };
  }

  async register(
    createUserDto: CreateUserDto,
    currentUser: User,
  ): Promise<User> {
    const { password, email } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = await this.createActivationToken(email);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
    };

    const user = await this.usersService.create(userData, currentUser);

    await this.sendActivationEmail(user, activationToken);

    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = await this.createActivationToken(email);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
    };
    const user = await this.usersService.signup(userData);

    await this.sendActivationEmail(user, activationToken);

    return user;
  }

  async createActivationToken(email: string): Promise<string> {
    return this.jwtService.signAsync({ email }, { expiresIn: '1d' });
  }

  async sendActivationEmail(user: User, token: string): Promise<void> {
    const activationLink = `${process.env.FRONTEND_URL}/users/activate/${token}`;
    const subject = 'Activate Your Account';
    const text = `Hello ${user.firstName},\n\nPlease activate your account using the link below:\n\n${activationLink}`;
    const html = this.emailTemplatesService.getActivationEmail(
      user.firstName,
      activationLink,
    );

    await this.mailerService.sendMail(user.email, subject, text, html);
  }

  async activateAccount(token: string): Promise<void> {
    try {
      const payload = await this.verifyToken(token);
      const email = payload.email;

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('Token de ativação inválido.');
      }

      await this.usersService.update(user.id, { isActive: true }, user);
    } catch (err) {
      console.error('Activation error:', err);
      if (
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpiredError'
      ) {
        throw new BadRequestException(
          'Token de ativação inválido ou expirado.',
        );
      } else if (err instanceof NotFoundException) {
        throw err;
      } else {
        throw new BadRequestException('Um erro ocorreu durante a ativação.');
      }
    }
  }

  async createPasswordResetToken(email: string): Promise<string> {
    return this.jwtService.signAsync({ email }, { expiresIn: '1h' });
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Não foi encontrado usuário com o email fornecido.',
      );
    }

    const resetToken = await this.createPasswordResetToken(email);

    const resetLink = `${process.env.FRONTEND_URL}/users/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `Hello ${user.firstName},\n\nPlease use the following link to reset your password:\n\n${resetLink}`;
    const html = this.emailTemplatesService.getPasswordResetEmail(
      user.firstName,
      resetLink,
    );

    await this.mailerService.sendMail(email, subject, text, html);
  }

  async resetPassword(
    token: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      const payload = await this.verifyToken(token);
      const email = payload.email;

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('Token de reset inválido.');
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Senha antiga está incorreta.');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException(
          'Nova senha e confirmação não são iguais',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.update(
        user.id,
        { password: hashedPassword },
        user,
      );
    } catch (err) {
      console.error('Reset Password error:', err);
      if (
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpiredError'
      ) {
        throw new BadRequestException('Token de reset inválido ou expirado');
      }
      throw err;
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
