import type { Request } from 'express';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import * as _ from 'lodash';
import prisma from '../prisma';

export function safeToTransmit(
  user: User,
): Omit<User, 'password' | 'createdAt' | 'updatedAt'> {
  return _.omit(user, ['password', 'createdAt', 'updatedAt']);
}

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

export async function signup(user: Pick<User, 'email' | 'name' | 'password'>) {
  const passwordHash = user.password
    ? await bcrypt.hash(user.password, 10)
    : null;

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: passwordHash,
    },
  });

  return { user: newUser };
}
