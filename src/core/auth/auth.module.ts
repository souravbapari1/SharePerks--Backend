import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { LogService } from 'src/global/log/log.service';
import { LogModule } from 'src/global/log/log.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    AdminModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    LogModule,
  ],
})
export class AuthModule {}
