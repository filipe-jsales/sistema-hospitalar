import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CaslModule } from '../casl/casl.module';
import { JwtConfigModule } from 'src/auth/jwt-config.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { EmailTemplatesModule } from 'src/email-templates/email-templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtConfigModule,
    CaslModule,
    MailerModule,
    EmailTemplatesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
