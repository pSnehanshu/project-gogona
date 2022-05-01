import * as express from "express";
import { IsEmail, MinLength } from "class-validator";
import { ValidateBody } from "../utils/request-validator";
import { login } from "../services/user.service";
import { RespondError, RespondSuccess } from "../utils/response";
import { Errors } from "../../shared/errors";

const auth = express.Router();

class LoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

auth.post("/login", ValidateBody(LoginDTO), async (req, res) => {
  try {
    const { email, password } = req.body as LoginDTO;
    const { user } = await login(email, password);

    RespondSuccess(res, user);
  } catch (error) {
    RespondError(res, Errors.LOGIN_FAILED, {
      statusCode: 401,
      errorSummary: "Login failed, please try again",
    });
  }
});

export default auth;
