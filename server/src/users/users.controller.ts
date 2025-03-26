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
import { CheckPolicies } from '../casl/casl-ability.factory/policies.decorator';
import { Action } from '../casl/casl-ability.factory/action.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, User))
  async findAll(@Request() req): Promise<User[]> {
    const currentUser = req.user;
    return this.usersService.findAll(currentUser);
  }

  @Post('create-user')
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  async createUser(
    @Body() createUserRequestDto: CreateUserDto,
    @Request() req,
  ): Promise<{ message: string }> {
    const currentUser = req.user;
    await this.usersService.create(createUserRequestDto, currentUser);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, User))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<User> {
    const currentUser = req.user;
    return this.usersService.findOne(id, currentUser);
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
    const currentUser = req.user;
    if (!isOwnProfile && !isSuperAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este perfil.',
      );
    }
    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @Post(':userId/roles/:roleId')
  @CheckPolicies((ability) => ability.can(Action.Update, User))
  async addRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Request() req,
  ): Promise<User> {
    const currentUser = req.user;
    return this.usersService.addRoleToUser(userId, roleId, currentUser);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, User))
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const currentUser = req.user;
    return this.usersService.remove(id, currentUser);
  }
}
