import type { Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

export async function login(req: Request, email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error();
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password!);

  if (!isPasswordCorrect) {
    throw new Error();
  }

  req.session.user = user;

  return { user };
}
