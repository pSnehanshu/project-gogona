import * as express from 'express';
import {
  IsEmail,
  MinLength,
  IsString,
  MaxLength,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { ValidateRequest } from '../utils/request-validator';
import {
  safeToTransmitUser,
  sendOtp,
  verifyOtp,
} from '../services/user.service';
import { RespondError, RespondSuccess } from '../utils/response';
import { Errors } from '../../shared/errors';
import bcrypt, { compareSync } from 'bcryptjs';
import prisma from '../prisma';
import { verify as verifyCaptcha } from 'hcaptcha';

const auth = express.Router();

// Check login
auth.get('/whoami', (req, res) => {
  if (!req.session.user) {
    return RespondError(res, Errors.UNAUTHORIZED, {
      statusCode: 401,
    });
  }

  RespondSuccess(res, safeToTransmitUser(req.session.user), 200);
});

// Logout
auth.delete('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      RespondError(res, Errors.LOGOUT_ERROR, {
        statusCode: 500,
        errorSummary: 'Failed to logout',
      });
    } else {
      RespondSuccess(res, null, 200);
    }
  });
});

class SubscriberSendOTP_DTO {
  @IsPhoneNumber('IN')
  phoneNumber!: string;
}

// Subscriber login
auth.post(
  '/login-subscriber/send-otp',
  ValidateRequest('body', SubscriberSendOTP_DTO),
  async (req, res) => {
    try {
      const { phoneNumber } = req.body as SubscriberSendOTP_DTO;
      const isdPhoneNum = `+91-${phoneNumber}`;

      let user = await prisma.user.findUnique({
        where: {
          phoneNumber: isdPhoneNum,
        },
        include: {
          Subscriber: true,
          Creator: true,
        },
      });

      if (user && !user.Subscriber) {
        console.error('User is not a subscriber');
        return RespondError(res, Errors.LOGIN_FAILED, {
          statusCode: 401,
          errorSummary: 'User is not a subscriber',
        });
      }

      if (!user) {
        // New user, let's register and send otp
        user = await prisma.user.create({
          data: {
            phoneNumber: isdPhoneNum,
            phoneNumberVerified: false,
            name: '',
            Subscriber: {
              create: {},
            },
          },
          include: {
            Subscriber: true,
            Creator: true,
          },
        });
      }

      try {
        await sendOtp(user.id);
      } catch (error) {
        console.error(error);
        return RespondError(res, Errors.LOGIN_FAILED, {
          statusCode: 500,
          errorSummary: 'Failed to send OTP, please try again',
        });
      }

      RespondSuccess(res, { userId: user.id }, 200);
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.LOGIN_FAILED, {
        statusCode: 500,
      });
    }
  },
);

class SubscriberVerifyOTP_DTO {
  @IsString()
  userId!: string;

  @IsString()
  otp!: string;
}

auth.post(
  '/login-subscriber/verify-otp',
  ValidateRequest('body', SubscriberVerifyOTP_DTO),
  async (req, res) => {
    try {
      const { otp, userId } = req.body as SubscriberVerifyOTP_DTO;

      const isValidOtp = await verifyOtp(userId, otp);

      if (!isValidOtp) {
        return RespondError(res, Errors.LOGIN_FAILED, {
          statusCode: 401,
          errorSummary: 'Either user does not exists or OTP is invalid',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Creator: true,
          Subscriber: true,
        },
      });

      if (user && !user.Subscriber) {
        console.error('User is not a subscriber');
        return RespondError(res, Errors.LOGIN_FAILED, {
          statusCode: 401,
          errorSummary: 'User is not a subscriber',
        });
      }

      req.session.user = user!;

      RespondSuccess(res, safeToTransmitUser(user!));
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.LOGIN_FAILED, {
        statusCode: 401,
        errorSummary: 'Login failed, please try again',
      });
    }
  },
);

class CreatorLoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(4)
  password!: string;
}

auth.post(
  '/login-creator',
  ValidateRequest('body', CreatorLoginDTO),
  async (req, res) => {
    try {
      const { email, password } = req.body as CreatorLoginDTO;
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          Creator: true,
          Subscriber: true,
        },
      });

      if (!user) {
        throw new Error('User does not exists');
      }

      if (!user.Creator) {
        throw new Error('User must be a creator');
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password!);

      if (!isPasswordCorrect) {
        throw new Error('Incorrect password');
      }

      req.session.user = user;

      RespondSuccess(res, safeToTransmitUser(user));
    } catch (error) {
      RespondError(res, Errors.LOGIN_FAILED, {
        statusCode: 401,
        errorSummary: 'Login failed, please try again',
      });
    }
  },
);

class CreatorSignupDTO {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(4)
  password!: string;

  @MinLength(3)
  @MaxLength(15)
  @Matches(/^@?(\w)+$/)
  handle!: string;

  @IsString()
  hcaptcha_token!: string;
}

auth.post(
  '/signup-creator',
  ValidateRequest('body', CreatorSignupDTO),
  async (req, res) => {
    try {
      const { name, email, password, handle, hcaptcha_token } =
        req.body as CreatorSignupDTO;

      const captchaData = await verifyCaptcha(
        process.env.HCAPTCHA_SECRET!,
        hcaptcha_token,
      );
      if (!captchaData.success) {
        return RespondError(res, Errors.SIGNUP_FAILED, {
          statusCode: 400,
          errorSummary: 'Invalid captcha',
        });
      }

      // Check if email is unique
      const emailUserCount = await prisma.user.count({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });
      if (emailUserCount > 0) {
        return RespondError(res, Errors.SIGNUP_FAILED, {
          statusCode: 400,
          errorSummary: 'Email is already used by another account',
        });
      }

      // Check if handle is unique
      const handleUserCount = await prisma.creator.count({
        where: {
          handle: {
            equals: handle,
            mode: 'insensitive',
          },
        },
      });
      if (handleUserCount > 0) {
        return RespondError(res, Errors.SIGNUP_FAILED, {
          statusCode: 400,
          errorSummary: 'Handle is already taken',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
          Creator: {
            create: {
              handle,
            },
          },
        },
        include: {
          Creator: true,
          Subscriber: true,
        },
      });

      // Set session
      req.session.user = user;

      RespondSuccess(res, safeToTransmitUser(user));
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.SIGNUP_FAILED, {
        statusCode: 500,
        errorSummary: 'Failed to signup, please try again',
      });
    }
  },
);

export default auth;
