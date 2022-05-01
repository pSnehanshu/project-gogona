import * as express from "express";
import { IsEmail, MinLength } from "class-validator";
import { ValidateBody } from "../utils/request-validator";

const auth = express.Router();

class LoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

auth.post("/login", ValidateBody(LoginDTO), (req, res) => {
  const { email, password } = req.body as LoginDTO;

  res.json({ email, password });
});

export default auth;
