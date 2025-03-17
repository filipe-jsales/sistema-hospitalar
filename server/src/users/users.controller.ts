import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Post,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PoliciesGuard } from '../casl/casl-ability.factory/policies.guard';
import {
  CheckPolicies,
  Public,
} from '../casl/casl-ability.factory/policies.decorator';
import { Action } from '../casl/casl-ability.factory/action.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { CreateUserRequestDto } from './dto/info-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('create-user')
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<{ message: string }> {
    const { userInfos } = createUserRequestDto;
    await this.authService.register(userInfos);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, User))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @Request() req,
  ): Promise<User> {
    const isOwnProfile = req.user.id === id;
    const isSuperAdmin = req.user.roles?.some(
      (role) => role.name === 'superadmin',
    );
    //TODO: check better ways to (modularize) owner and superadmin checks also if we need to enumerate/interface this
    if (!isOwnProfile && !isSuperAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este perfil.',
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @Post(':userId/roles/:roleId')
  async addRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<User> {
    return this.usersService.addRoleToUser(userId, roleId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
