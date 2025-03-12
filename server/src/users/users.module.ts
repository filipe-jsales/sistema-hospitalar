import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailerModule } from '../mailer/mailer.module';
import { EmailTemplatesModule } from 'src/email-templates/email-templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule,
    EmailTemplatesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
