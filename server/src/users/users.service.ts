import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

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

    const activationLink = `http://localhost:8100/users/activate/${activationToken}`;
    const subject = 'Activate Your Account';
    const text = `Hello ${user.firstName},\n\nPlease activate your account using the link below:\n\n${activationLink}`;
    const html = `<p>Hello ${user.firstName},</p><p>Please activate your account using the link below:</p><a href="${activationLink}">Activate Account</a>`;

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
        throw new Error('Invalid activation token');
      }

      user.isActive = true;
      await this.usersRepository.save(user);
    } catch (err) {
      console.log(err);
      throw new Error('Invalid or expired activation token');
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is not activated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      await this.usersRepository.save(user);
      throw new Error('Invalid email or password');
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return { token };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('No user found with the provided email');
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `http://localhost:8100/users/reset-password/${resetToken}`;

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
        throw new Error('Invalid reset token');
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new Error('Old password is incorrect');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await this.usersRepository.save(user);
    } catch (err) {
      console.log(err);
      throw new Error('Invalid or expired reset token');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
