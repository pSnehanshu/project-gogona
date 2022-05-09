import type { User } from '@prisma/client';
import * as _ from 'lodash';

export function safeToTransmitUser(
  user: User,
): Omit<User, 'password' | 'createdAt' | 'updatedAt'> {
  return _.omit(user, ['password', 'createdAt', 'updatedAt']);
}
