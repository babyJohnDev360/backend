import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/Schema/user.schema';
import { AuthModule } from 'src/common/auth/auth.module';
import { FundAllot, FundAllotSchema } from 'src/common/Schema/fundAllot.schema';
import { ServiceFee, ServiceFeeSchema } from 'src/common/Schema/serviceFee.schema';

@Module({
  imports : [AuthModule,MongooseModule.forFeature(
    [{name : User.name , schema : UserSchema},
      {name : FundAllot.name , schema : FundAllotSchema},
      {name : ServiceFee.name , schema : ServiceFeeSchema}
    ])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
