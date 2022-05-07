import { Errors } from './errors';
import { safeToTransmitUser } from '../backend/services/user.service';
import { safeToTransmitPost } from '../backend/services/post.service';
import type { Creator as CreatorType } from '@prisma/client';

export type SuccessResponse<T = unknown> = {
  statusCode: number;
  success: true;
  data: T;
};

export type ErrorResponse<T = unknown> = {
  statusCode: number;
  success: false;
  data: null | T;
  type: Errors;
  message: string;
};

// These are for frontend
export type User = ReturnType<typeof safeToTransmitUser>;
export type Post = ReturnType<typeof safeToTransmitPost>;
export type Creator = CreatorType & {
  User: User;
};
