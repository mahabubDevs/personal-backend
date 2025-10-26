import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IStripeAccountInfo {
    status: string;
    stripeAccountId: string;
    externalAccountId: string;
    currency: string;
}

interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    _id: Types.ObjectId;
    name: string;
    // userName?: string;
    appId: string;
    role: USER_ROLES;
    contact: string;
    email: string;
    password: string;
    location: string;
    profile: string;
    verified: boolean;
    status: boolean;
    authentication?: IAuthenticationProps;
    accountInformation?: IStripeAccountInfo;
    stripeAccountId?: string;
    pages?: string[];
    customeRole?: string;
    createdAt?: Date;
  updatedAt?: Date;



  // ================================================= additonal filed for client new update ==========================================

    planType?: "NONE" | "FREE_TRIAL" | "MONTHLY" | "YEARLY";
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
    isSubscribed?: boolean;


}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isAccountCreated(id: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;

