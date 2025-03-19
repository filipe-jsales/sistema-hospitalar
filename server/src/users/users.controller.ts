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
  async findAll(@Request() req): Promise<User[]> {
    const currentUser = req.user;
    return this.usersService.findAll(currentUser);
  }

  @Post('create-user')
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  async createUser(
    @Body() createUserRequestDto: CreateUserRequestDto,
    @Request() req,
  ): Promise<{ message: string }> {
    const currentUser = req.user;
    const { userInfos } = createUserRequestDto;
    await this.authService.register(userInfos, currentUser);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Get(':id')
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
    //TODO: check better ways to (modularize) owner and superadmin checks also if we need to enumerate/interface this
    if (!isOwnProfile && !isSuperAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este perfil.',
      );
    }

    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @Post(':userId/roles/:roleId')
  async addRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Request() req,
  ): Promise<User> {
    const currentUser = req.user;
    return this.usersService.addRoleToUser(userId, roleId, currentUser);
  }

  @Post(':userId/hospital/:hospitalId')
  @CheckPolicies((ability) => ability.can(Action.Update, User))
  async assignHospitalToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('hospitalId', ParseIntPipe) hospitalId: number,
    @Request() req,
  ): Promise<User> {
    const currentUser = req.user;
    const isSuperAdmin = currentUser.roles?.some(
      (role) => role.name === 'superadmin',
    );

    if (
      !isSuperAdmin &&
      !(
        currentUser.hospital?.id === hospitalId &&
        currentUser.roles?.some((role) => role.name === 'admin')
      )
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atribuir usuários a este hospital.',
      );
    }

    return this.usersService.assignHospitalToUser(
      userId,
      hospitalId,
      currentUser,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    const currentUser = req.user;
    return this.usersService.remove(id, currentUser);
  }
}
