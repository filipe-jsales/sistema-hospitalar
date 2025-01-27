import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserRequestDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { User } from './entities/user.entity';
import { PoliciesGuard } from '../casl/casl-ability.factory/policies.guard';
import {
  CheckPolicies,
  Public,
} from '../casl/casl-ability.factory/policies.decorator';
import { Action } from '../casl/casl-ability.factory/action.enum';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: need to remove after fully tested register/activate/login user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('register')
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  async register(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<{ message: string }> {
    const { userInfos, user } = createUserRequestDto;
    console.log('USER', user);
    console.log('USER IINFO', userInfos);
    await this.usersService.create(userInfos);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Get('activate/:token')
  @Public()
  async activate(@Param('token') token: string): Promise<{ message: string }> {
    await this.usersService.activateAccount(token);
    return { message: 'Sua conta foi ativada com sucesso.' };
  }

  @Post('login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto): Promise<{
    token: string;
    user: { id: number; email: string; role: string };
  }> {
    const { email, password } = loginUserDto;
    return this.usersService.login(email, password);
  }

  @Post('reset-password-request')
  @Public()
  async resetPasswordRequest(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.usersService.sendPasswordResetEmail(email);
    return { message: 'Email de reset enviado com sucesso. Redirecionando...' };
  }

  @Post('reset-password/:token')
  @Public()
  async resetPassword(
    @Param('token') token: string,
    @Body()
    resetPasswordDto: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(
      token,
      resetPasswordDto.oldPassword,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );
    return { message: 'Senha resetada com sucesso. Redirecionando...' };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
