import { safeToTransmitUser } from '../../backend/services/user.service';
import { safeToTransmitPost } from '../../backend/services/post.service';
import { Creator as CreatorType } from '@prisma/client';

export type User = ReturnType<typeof safeToTransmitUser>;

export type Post = ReturnType<typeof safeToTransmitPost>;

export type Creator = CreatorType & {
  User: User;
};
