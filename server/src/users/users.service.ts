import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailTemplatesService } from 'src/email-templates/email-templates.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailTemplatesService: EmailTemplatesService,
    private mailerService: MailerService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = await this.jwtService.signAsync(
      { email },
      { expiresIn: '1d' },
    );

    const user = await this.createInactive({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.sendActivationEmail(user, activationToken);

    return user;
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

  async createInactive(userData: Partial<User>): Promise<User> {
    const { email } = userData;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado.');
    }

    const user = this.usersRepository.create({
      ...userData,
      isActive: false,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
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
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
