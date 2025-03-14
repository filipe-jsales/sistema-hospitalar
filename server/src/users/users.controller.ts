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
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserRequestDto } from './dto/info-user.dto';
import { User } from './entities/user.entity';
import { PoliciesGuard } from '../casl/casl-ability.factory/policies.guard';
import {
  CheckPolicies,
  Public,
} from '../casl/casl-ability.factory/policies.decorator';
import { Action } from '../casl/casl-ability.factory/action.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @Public()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // TODO: ao criar um usuário automaticamente popular a tabela de user roles roles com a role que for criada
  @Post('create-user')
  @CheckPolicies((ability) => ability.can(Action.Create, User))
  async register(
    @Body() createUserRequestDto: CreateUserRequestDto,
  ): Promise<{ message: string }> {
    const { userInfos } = createUserRequestDto;
    await this.usersService.register(userInfos);
    return { message: 'Usuário cadastrado com sucesso.' };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
