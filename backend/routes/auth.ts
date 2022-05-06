import * as express from 'express';
import { IsEmail, MinLength, IsString } from 'class-validator';
import { ValidateBody } from '../utils/request-validator';
import { login, signup, safeToTransmitUser } from '../services/user.service';
import { RespondError, RespondSuccess } from '../utils/response';
import { Errors } from '../../shared/errors';
import app from '.';

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
  password?: string;
}

auth.post('/signup', ValidateBody(SignupDTO), async (req, res) => {
  try {
    const { name, email, password } = req.body as SignupDTO;
    const { user } = await signup({ name, email, password: password || null });

    RespondSuccess(res, safeToTransmitUser(user));
  } catch (error) {
    RespondError(res, Errors.SIGNUP_FAILED, {
      statusCode: 500,
      errorSummary: 'Failed to signup, please try again',
    });
  }
});

export default auth;
