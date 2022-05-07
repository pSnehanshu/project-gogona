import * as express from 'express';
import {
  IsEmail,
  MinLength,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { ValidateBody } from '../utils/request-validator';
import { login, safeToTransmitUser } from '../services/user.service';
import { RespondError, RespondSuccess } from '../utils/response';
import { Errors } from '../../shared/errors';
import bcrypt from 'bcryptjs';
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

class LoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(4)
  password!: string;
}

auth.post('/login', ValidateBody(LoginDTO), async (req, res) => {
  try {
    const { email, password } = req.body as LoginDTO;
    const { user } = await login(req, email, password);

    RespondSuccess(res, safeToTransmitUser(user));
  } catch (error) {
    RespondError(res, Errors.LOGIN_FAILED, {
      statusCode: 401,
      errorSummary: 'Login failed, please try again',
    });
  }
});

class SignupDTO {
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

auth.post('/signup-creator', ValidateBody(SignupDTO), async (req, res) => {
  try {
    const { name, email, password, handle, hcaptcha_token } =
      req.body as SignupDTO;

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
});

export default auth;
