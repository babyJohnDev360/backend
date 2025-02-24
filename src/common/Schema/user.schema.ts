import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})
export class BankDetails {
    @Prop()
    name : string;
    @Prop()
    accountNo : string;
    @Prop()
    branch : string;
    @Prop()
    ifsc : string;
    @Prop()
    panNumber : string;

}
export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails)
@Schema({timestamps : true})
export class User {

    @Prop()
    name: string;

    @Prop()
    email :string ;
   
    @Prop()
    panNo :string ;

    @Prop()
    password  :string ;

    @Prop({type :BankDetailsSchema} )
    bankDetails  :BankDetails ;

    @Prop()
    image :string ;

    @Prop({default: true})
    isActive: boolean

}

export const UserSchema = SchemaFactory.createForClass(User)
