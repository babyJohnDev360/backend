import { TestingModule } from '@nestjs/testing';
import { FundAllotQueryByUserDto, UserListDto } from './../common/DTO/fundAllot-user.dto';
import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '../common/DTO/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/common/Schema/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { AuthService } from 'src/common/auth/auth.service';
import { FundAllot } from 'src/common/Schema/fundAllot.schema';
import {
  CreateFundAllotDto,
  FundAllotQueryDto,
  UpdateFundAllotDto,
} from 'src/common/DTO/fundAllot-user.dto';
import { ServiceFee } from 'src/common/Schema/serviceFee.schema';
import {
  CreateServiceFeeDto,
  getServiceFeeDto,
  UpdateServiceFeeDto,
} from 'src/common/DTO/serviceFee-user.dto';
import { skip } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(FundAllot.name) private FundAllotModel: Model<FundAllot>,
    @InjectModel(ServiceFee.name) private ServiceFeeModel: Model<ServiceFee>,
    private readonly authservice: AuthService,
  ) {}

  async SignUp(userAdminId,createUserDto: CreateUserDto) {
    try {
      const isAdmin = await this.checkUser(userAdminId)
      if(!isAdmin) return {status :false , message : "Only admin can add and update data"}
      const hashedPassword = crypto
        .createHash('sha256')
        .update(createUserDto.password)
        .digest('hex');

      const data = {
        ...createUserDto,
        password: hashedPassword,
        //  image: file.originalname,
      };
      const newUser = await this.UserModel.create(data);

      return {
        status: true,
        message: 'User Created Successfull',
        userId:  newUser._id

      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(loginUserDto.password)
      .digest('hex');
    const checkUser = await this.UserModel.find({
      email: loginUserDto.email,
      password: hashedPassword,
    });
    if (!checkUser) {
      return {
        status: false,
        messsage: 'email or password is wrong ',
      };
    }
    const token = await this.authservice.createAccessToken(checkUser[0]);

    return {
      status: true,
      messsage: 'Login successfull',
      token,
    }
   } catch (error) {
    return {
      status: false,
      messsage: 'email or password is wrong ',
    };
    }
  }
  async adminLogin(loginUserDto: LoginUserDto) {
    try {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(loginUserDto.password)
      .digest('hex');
    const checkUser = await this.UserModel.find({
      email: loginUserDto.email,
      password: hashedPassword,
    });
    if (!checkUser) {
      return {
        status: false,
        messsage: 'email or password is wrong ',
      };
    }
  console.log(checkUser,"============>");
  
    if(checkUser[0].role === "Admin"){
      let token = await this.authservice.createAccessToken(checkUser[0]);
       return {
        status: true,
        messsage: 'Login successfull',
        token,
      }
    }else{
      return {
        status: false,
        messsage: "Only Admin can Login",
      }
    }
   } catch (error) {
    return {
      status: false,
      messsage: 'email or password is wrong ',
    };
    }
  }

  async edit(userId, updateUserDto: UpdateUserDto) {
    try {
      const updateData = await this.UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...updateUserDto,
          },
        },
        { new: true },
      );
      console.log(updateData);

      return {
        status: true,
        message: 'Update Succssfully',
      };
    } catch (error) {
      return {
        status: false,
        error: error.message,
      };
    }
  }

  async remove(userId) {
    try {
      const id = new Types.ObjectId(userId);
      const remove = await this.UserModel.deleteOne(id);
      return { status: true };
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        error: error.message,
      };
    }
  }

  async list( userId,UserListDto: UserListDto) {
    try {
      const isAdmin = await this.checkUser(userId)
      let payload;
      let skip = UserListDto.limit * UserListDto.page ;  // Skip the correct number of documents based on the page
      let limit = UserListDto.limit;  // Limit is the number of items per page
      if(isAdmin){
        if (UserListDto.userId) {
          payload = { _id: new mongoose.Types.ObjectId(UserListDto.userId) };
        } else {
          payload = {};
        }
        const users = await this.UserModel.find(payload)
          .select({ password: 0 })
          .skip(skip)
          .limit(limit);      
        const count = await this.UserModel.countDocuments();
        return {
          status: true,
          total: count,
          users,
        }
      } else{
        const users = await this.UserModel.find({_id:new mongoose.Types.ObjectId(userId)})
        .select({ password: 0 })
        .skip(skip)
        .limit(limit);      
      const count = await this.UserModel.countDocuments();
      return {
        status: true,
        total: count,
        users,
      }
      }
   
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        error: error.message,
      };
    }
  }
  async userNameList(UserId:any,UserListDto) {
    try {
      const isAdmin = await this.checkUser(UserId)
      if(!isAdmin) return {status :false , message : "Only admin can add and update data"}

       let payload = { _id: new mongoose.Types.ObjectId(UserId) };
       const searchQuery: any[] = [];

       if (UserListDto.search) {
        // Use $or to search across multiple fields
        searchQuery.push({
          $or: [
            { clientId: { $regex: UserListDto.search, $options: 'i' } },
            { name: { $regex: UserListDto.search, $options: 'i' } },
            { email: { $regex: UserListDto.search, $options: 'i' } }
          ]
        });
      }
       const users = await this.UserModel.find().select({ name: 1, _id : 1, clientId : 1 })     
      const count = await this.UserModel.countDocuments();
      return {
        status: true,
        total: count,
        users,
      };
    } catch (error) {
      console.log(error.message);
      return {
        status: false,
        error: error.message,
      };
    }
  }

  async addfundAllot(userAdminId,createFundAllotDto: CreateFundAllotDto) {
    try {
      const isAdmin = await this.checkUser(userAdminId)
      if(!isAdmin) return {status :false , message : "Only admin can add and update data"}
      const getBalance = await this.getFund(createFundAllotDto.userId, {
        limit: 1,
        page: 1,
      });
    
      const existingBalance = getBalance?.data[0]?.balance || 0;

      const balance =
        createFundAllotDto.type === 'add'
          ? existingBalance + createFundAllotDto.amount
          : existingBalance - createFundAllotDto.amount;

      const payload = { ...createFundAllotDto, balance };

      const createdFundAllot = await this.FundAllotModel.create(payload);
      return {
        status: true,
        message: 'Created Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async updateFund(userId, updateFundAllotDto: UpdateFundAllotDto) {
    try {
      const { fundId, ...updateData } = updateFundAllotDto;

      const updatedFundAllot = await this.FundAllotModel.findByIdAndUpdate(
        fundId,
        updateData,
        { new: true },
      );

      if (!updatedFundAllot) {
        return {
          status: false,
          message: 'Fund Allotment not found',
        };
      }

      return {
        status: true,
        message: 'Updated Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async removeFund(fundId) {
    try {
      const result = await this.FundAllotModel.deleteOne({
        _id: new mongoose.Types.ObjectId(fundId),
      });

      if (result.deletedCount === 0) {
        return {
          status: false,
          message: 'Fund Allotment not found',
        };
      }

      return {
        status: true,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async getFund(userId, fundAllotQueryDto: FundAllotQueryDto) {
    try {
      const { limit = 50, page = 1 } = fundAllotQueryDto;
      const skip = (page - 1) * limit;

      const data = await this.FundAllotModel.find({ userId: userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);

      return {
        status: true,
        data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }


  async getFundByUserId(FundAllotQueryByUserDto: FundAllotQueryByUserDto) {
    try {
      const { limit = 10, page = 0 } = FundAllotQueryByUserDto;
      const skip = page * limit;
      const data = await this.FundAllotModel.find({ userId:FundAllotQueryByUserDto.userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);
        const count = await this.FundAllotModel.countDocuments({ userId:FundAllotQueryByUserDto.userId });

      return {
        status: true,
        total : count,
        data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async addserviceFee(userAdminId,createServiceFeeDto: CreateServiceFeeDto) {
    try {
      const isAdmin = await this.checkUser(userAdminId)
      if(!isAdmin) return {status :false , message : "Only admin can add and update data"}
      const data = await this.ServiceFeeModel.create(createServiceFeeDto);
      return {
        status: true,
        message: 'Created Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async updateServiceFee(userAdminId, updateServiceFeeDto: UpdateServiceFeeDto) {
    try {
      const { serviceFeeId, ...updateData } = updateServiceFeeDto;
      const isAdmin = await this.checkUser(userAdminId)
      if(!isAdmin) return {status :false , message : "Only admin can add and update data"}
      const updatedFundAllot = await this.ServiceFeeModel.findByIdAndUpdate(
        serviceFeeId,
        updateData,
        { new: true },
      );

      return {
        status: true,
        message: 'Updated Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async removeServiceFee(fundId) {
    try {
      const result = await this.ServiceFeeModel.deleteOne({
        _id: new mongoose.Types.ObjectId(fundId),
      });

      if (result.deletedCount === 0) {
        return {
          status: false,
          message: 'Fund Allotment not found',
        };
      }

      return {
        status: true,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async getServiceFee(userId, getServiceFeeDto: getServiceFeeDto) {
    try {
      const serviceData = await this.ServiceFeeModel.aggregate([
        {
          $match: { userId: userId }
        },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);
  
      const transaction = await this.ServiceFeeModel.find({ userId: userId });
  
      const feePaidData = serviceData.find(item => item._id === "fee_paid");
      const creditNoteData = serviceData.find(item => item._id === "credit_note");
      const goodwillData = serviceData.find(item => item._id === "goodwill");
  
      const totalAmount = serviceData.length > 0 ? serviceData[0].totalAmount : 0;
  
      const fundData = await this.FundAllotModel.find({ userId: userId })
        .sort({ updatedAt: -1 })
        .limit(1);
  
      let thirtyPercent = 0;
      if (fundData && fundData.length > 0) {
        const serviceFeePayable = fundData[0].balance;
        thirtyPercent = serviceFeePayable * 0.30;
      }
  
      const data = {
        serviceFeesPayable: thirtyPercent,
        serviceFeePaid: feePaidData ? feePaidData.totalAmount : 0,
        creditNoteApplied: creditNoteData ? creditNoteData.totalAmount : 0,
        goodWillApplied: goodwillData ? goodwillData.totalAmount : 0,
        balancePayable: thirtyPercent - (feePaidData?.totalAmount || 0) - (creditNoteData?.totalAmount || 0) - (goodwillData?.totalAmount || 0),
        transaction: transaction
      };
  
      return {
        status: true,
        data: data
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  

  async getServiceFeeByUserId(fundAllotQueryDto: UserListDto) {
    try {
      const { limit = 50, page = 1 } = fundAllotQueryDto;
      const skip = (page - 1) * limit;

      const data = await this.ServiceFeeModel.find({ userId:fundAllotQueryDto.userId })
        .sort({ updatedAt: -1 })
        //.limit(limit)
       // .skip(skip);

      return {
        status: true,
        data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async checkUser(userId){
    try {
      const userData = await this.UserModel.findById(userId)
      console.log(userData, "userData ");
      
      if(userData.role === "Admin"){
        return  true
      }else{
        return false 
    }
    } catch (error) {
      return {
      status : false ,
      message : error.message
      }
    }
  }
}
