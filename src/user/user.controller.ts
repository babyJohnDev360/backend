/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '../common/DTO/create-user.dto';
import { AuthGuard } from 'src/common/auth/guard/auth.guard';
import { ExtractUserId } from 'src/common/auth/decorator/extract.token';
import {
  CreateFundAllotDto,
  FundAllotQueryByUserDto,
  FundAllotQueryDto,
  UpdateFundAllotDto,
  UserListDto,
} from 'src/common/DTO/fundAllot-user.dto';
import {
  CreateServiceFeeDto,
  getServiceFeeDto,
  UpdateServiceFeeDto,
} from 'src/common/DTO/serviceFee-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  // @UseInterceptors(FileInterceptor('image'))
  SignUp(
    @ExtractUserId() userAdminId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.SignUp(userAdminId,createUserDto);
  }

  @Post('login')
  Login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('adminLogin')
  AdminLogin(@Body() loginUserDto: LoginUserDto) {
    return this.userService.adminLogin(loginUserDto);
  }

  @Post('edit') 
  @UseGuards(AuthGuard)
  EditUser(
    @ExtractUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.edit(userId, updateUserDto);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  remove(@ExtractUserId() userId: string) {
    return this.userService.remove(userId);
  }

  @Post('list')
  list( @ExtractUserId() userId: string,
  @Body() UserListDto: UserListDto) {
    return this.userService.list(userId,UserListDto) 
  }

  @Post('userNameList')
  userNameList( @ExtractUserId() userId: any,
  @Body() UserListDto: UserListDto) {
    return this.userService.userNameList(userId,UserListDto)
  }

  @Post('addFund')
  @UseGuards(AuthGuard)
  AddFund(@ExtractUserId() userAdminId: string,
   @Body() CreateFundAllotDto: CreateFundAllotDto) {
    return this.userService.addfundAllot(userAdminId,CreateFundAllotDto);
  }

  @Post('updateFund')
  @UseGuards(AuthGuard)
  UpdateFund(
    @ExtractUserId() userId: string,
    @Body() UpdateFundAllotDto: UpdateFundAllotDto,
  ) {
    return this.userService.updateFund(userId, UpdateFundAllotDto);
  }

  @Delete('removeFund')
  @UseGuards(AuthGuard)
  removeFund(@Body() body: { fundId: string }) {
    return this.userService.removeFund(body.fundId);
  }

  @Get('getFund')
  @UseGuards(AuthGuard)
  GetFund(
    @ExtractUserId() userId: string,
    @Body() fundAllotQueryDto: FundAllotQueryDto,
  ) {
    return this.userService.getFund(userId, fundAllotQueryDto);
  }

  @Post('getFundByUserId')
  @UseGuards(AuthGuard)
  getFundByUserId(
    @Body() FundAllotQueryByUserDto: FundAllotQueryByUserDto,
  ) {
    return this.userService.getFundByUserId(FundAllotQueryByUserDto);
  }

  @Post('addserviceFee')
  @UseGuards(AuthGuard)
  AddserviceFee(
    @ExtractUserId()  userAdminId: string,
    @Body() CreateServiceFeeDto: CreateServiceFeeDto,
  ) {
    return this.userService.addserviceFee(userAdminId,CreateServiceFeeDto);
  }

  @Post('updateServiceFee')
  @UseGuards(AuthGuard)
  UpdateServiceFee(
    @ExtractUserId() userAdminId: string,
    @Body() UpdateServiceFeeDto: UpdateServiceFeeDto,
  ) {
    return this.userService.updateServiceFee(userAdminId, UpdateServiceFeeDto);
  }

  @Delete('removeServiceFee')
  @UseGuards(AuthGuard)
  RemoveServiceFee(@Body() body: { serviceFeeId: string }) {
    return this.userService.removeServiceFee(body.serviceFeeId);
  }

  @Get('getServiceFee')
  @UseGuards(AuthGuard)
  GetServiceFee(
    @ExtractUserId() userId: string,
    @Body() getServiceFeeDto: getServiceFeeDto,
  ) {
    return this.userService.getServiceFee(userId, getServiceFeeDto);
  }

  @Post('getServiceFeeByUserId')
  @UseGuards(AuthGuard)
  getServiceFeeByUserId(
    @ExtractUserId() userId: string,
    @Body() UserListDto: UserListDto,
  ) {
    return this.userService.getServiceFeeByUserId(UserListDto);
  }
}
