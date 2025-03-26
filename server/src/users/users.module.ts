import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaslModule } from '../casl/casl.module';
import { AuthModule } from 'src/auth/auth.module';
import { Role } from 'src/roles/entities/role.entity';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { Hospital } from 'src/hospitals/entities/hospital.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Hospital]),
    CaslModule,
    forwardRef(() => AuthModule),
    forwardRef(() => HospitalsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
