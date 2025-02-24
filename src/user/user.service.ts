import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../common/DTO/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/common/Schema/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { AuthService } from 'src/common/auth/auth.service';
import { FundAllot } from 'src/common/Schema/fundAllot.schema';
import { CreateFundAllotDto, FundAllotQueryDto, UpdateFundAllotDto } from 'src/common/DTO/fundAllot-user.dto';
import { ServiceFee } from 'src/common/Schema/serviceFee.schema';
import { CreateServiceFeeDto, UpdateServiceFeeDto } from 'src/common/DTO/serviceFee-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(FundAllot.name) private FundAllotModel : Model<FundAllot>,
    @InjectModel(ServiceFee.name) private ServiceFeeModel : Model<ServiceFee>,
    private readonly authservice: AuthService,
  ) {}

  async SignUp(createUserDto: CreateUserDto) {
    try {

      const hashedPassword = crypto
        .createHash('sha256')
        .update(createUserDto.password)
        .digest('hex');
 

      let data = {
        ...createUserDto,
        password: hashedPassword,
      //  image: file.originalname,
      };
      const newUser = await this.UserModel.create(data);

      return {
        status: true,
        message: 'User Created Successfull',
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(loginUserDto.password)
      .digest('hex');
    const checkUser = await this.UserModel.find({
      email: loginUserDto.email,
      password: hashedPassword,
    });
    if (!checkUser[0]) {
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
    };
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
        status:true,
        message : "Update Succssfully"
  
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

  async list(query: any) {
    try {
      const users = await this.UserModel.find().select({password : 0})
      const count = await this.UserModel.countDocuments();
      return {
        status: true,
       // totalPages: Math.ceil(count / query.limit),
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

  
  async addfundAllot(userId, createFundAllotDto: CreateFundAllotDto) {
    try {
      const getBalance = await this.getFund(userId, { limit: 1, page: 1 });
      const existingBalance = getBalance?.data[0]?.balance || 0;
      console.log(existingBalance);
      
      let balance = createFundAllotDto.type === "add"
        ? existingBalance + createFundAllotDto.amount
        : existingBalance - createFundAllotDto.amount;
        console.log(balance);
        
        const payload = { ...createFundAllotDto, userId, balance };

       
      const createdFundAllot = await this.FundAllotModel.create(payload);
      return {
        status: true,
        message: 'Created Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async updateFund(userId, updateFundAllotDto: UpdateFundAllotDto) {
    try {
      const { fundId, ...updateData } = updateFundAllotDto;
      
      
      const updatedFundAllot = await this.FundAllotModel.findByIdAndUpdate(fundId, updateData, { new: true });
      
      if (!updatedFundAllot) {
        return {
          status: false,
          message: 'Fund Allotment not found'
        };
      }
  
      return {
        status: true,
        message: 'Updated Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async removeFund(fundId) {
    try {
      const result = await this.FundAllotModel.deleteOne({ _id: new mongoose.Types.ObjectId(fundId) });
      
      if (result.deletedCount === 0) {
        return {
          status: false,
          message: 'Fund Allotment not found'
        };
      }
  
      return {
        status: true,
        message: 'Deleted Successfully'
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async getFund(userId, fundAllotQueryDto : FundAllotQueryDto) {  
    try {
      const { limit = 50, page = 1 } = fundAllotQueryDto;
      const skip = (page - 1) * limit;
  
      const data = await this.FundAllotModel.find({ userId: userId }).sort({updatedAt:-1})
        .limit(limit)
        .skip(skip);
  
      return {
        status: true,
        data
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }   
}   

  
  async addserviceFee(userId, createServiceFeeDto: CreateServiceFeeDto) {
    try {
    
      const payload = { ...createServiceFeeDto, userId };
      const data = await this.ServiceFeeModel.create(payload);
      return {
        status: true,
        message: 'Created Successfully'
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async updateServiceFee(userId, updateServiceFeeDto: UpdateServiceFeeDto) {
    try {
      const { serviceFeeId, ...updateData } = updateServiceFeeDto;
      
      
      const updatedFundAllot = await this.ServiceFeeModel.findByIdAndUpdate(serviceFeeId, updateData, { new: true });
  
      return {
        status: true,
        message: 'Updated Successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async removeServiceFee(fundId) {
    try {
      const result = await this.ServiceFeeModel.deleteOne({ _id: new mongoose.Types.ObjectId(fundId) });
      
      if (result.deletedCount === 0) {
        return {
          status: false,
          message: 'Fund Allotment not found'
        };
      }
  
      return {
        status: true,
        message: 'Deleted Successfully'
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  
  async getServiceFee(userId, fundAllotQueryDto) {
    try {
      const { limit = 50, page = 1 } = fundAllotQueryDto;
      const skip = (page - 1) * limit;
    
      const data = await this.ServiceFeeModel.find({ userId: userId }).sort({updatedAt:-1})
        .limit(limit)
        .skip(skip);
  
      return {
        status: true,
        data
      };
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }   
}   
}
