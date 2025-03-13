import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EmailTemplatesService } from 'src/email-templates/email-templates.service';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private mailerService: MailerService,
    private emailTemplatesService: EmailTemplatesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: false,
    });

    const savedUser = await this.usersRepository.save(user);

    const activationLink = `${process.env.FRONTEND_URL}/users/activate/${activationToken}`;
    const subject = 'Activate Your Account';
    const text = `Hello ${user.firstName},\n\nPlease activate your account using the link below:\n\n${activationLink}`;
    const html = this.emailTemplatesService.getActivationEmail(user.firstName, activationLink);

    await this.mailerService.sendMail(email, subject, text, html);

    return savedUser;
  }

  async activateAccount(token: string): Promise<void> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        email: string;
      };

      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException('Token de ativação inválido.');
      }

      user.isActive = true;
      await this.usersRepository.save(user);
    } catch (err) {
      console.error('Activation error:', err);
      if (err instanceof jwt.JsonWebTokenError) {
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

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: { id: number; email: string; roles: Role[] };
  }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new Error('Email ou senha inválidos.');
    }

    if (!user.isActive) {
      throw new Error('Sua conta não foi ativada.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      await this.usersRepository.save(user);
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);
    console.log(user);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(
        'Não foi encontrado usuário com o email fornecido.',
      );
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `${process.env.FRONTEND_URL}/users/reset-password/${resetToken}`;
    // TODO: refactor to use a template mailer to remove the template html from the service
    const subject = 'Password Reset Request';
    const text = `Hello ${user.firstName},\n\nPlease use the following link to reset your password:\n\n${resetLink}`;
    const html = `<p>Hello ${user.firstName},</p><p>Please use the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`;

    await this.mailerService.sendMail(email, subject, text, html);
  }

  async resetPassword(
    token: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        email: string;
      };

      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

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
      user.password = hashedPassword;

      await this.usersRepository.save(user);
    } catch (err) {
      console.error('Reset Password error:', err);
      throw new BadRequestException('Token de reset inválido ou expirado');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const userData = await this.findOne(id);
    await this.usersRepository.softRemove(userData);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
