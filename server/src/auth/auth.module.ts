import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { JwtConfigModule } from './jwt-config.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { EmailTemplatesModule } from 'src/email-templates/email-templates.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtConfigModule,
    MailerModule,
    EmailTemplatesModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}