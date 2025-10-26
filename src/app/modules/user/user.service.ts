import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";


const createAdminToDB = async (payload: any): Promise<IUser> => {

    // check admin is exist or not;
    const isExistAdmin = await User.findOne({ email: payload.email })
    if (isExistAdmin) {
        throw new ApiError(StatusCodes.CONFLICT, "This Email already taken");
    }

    // create admin to db
    const createAdmin = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    } else {
        await User.findByIdAndUpdate({ _id: createAdmin?._id }, { verified: true }, { new: true });
    }

    return createAdmin;
}

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {

    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    //send email
    const otp = generateOTP();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email!
    };

    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };

    await User.findOneAndUpdate(
        { _id: createUser._id },
        { $set: { authentication } }
    );

const admins = await User.find({ role: 'ADMIN' }).select('_id');

for (const admin of admins) {
  
}


return createUser;
}



const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser> & { totalPigeons: number }> => {
    const { _id } = user;

    // Check if user exists
    const isExistUser: any = await User.isExistUserById(_id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    // Count total pigeons created by this user




    return {
        ...isExistUser.toObject(), // mongoose document to plain object
        // contact: isExistUser.contact,

    };
};


const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { _id } = user;
    const isExistUser = await User.isExistUserById(_id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //unlink file here
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }

    const updateDoc = await User.findOneAndUpdate(
        { _id: _id },
        payload,
        { new: true }
    );
    return updateDoc;
};

 // ================================================= additonal filed for client new update ==========================================

 const selectPlan = async (user: JwtPayload, planType: string) => {
  const isExistUser = await User.isExistUserById(user._id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  let subscriptionStart = new Date();
  let subscriptionEnd: Date | null = null;

  if (planType === "FREE_TRIAL") {
    subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 month free
  } else if (planType === "MONTHLY") {
    subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
  } else if (planType === "YEARLY") {
    subscriptionEnd = new Date();
    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      planType,
      subscriptionStart,
      subscriptionEnd,
      isSubscribed: planType !== "NONE"
    },
    { new: true }
  );

  return updatedUser;
};
  


 



export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    createAdminToDB,
    selectPlan
};