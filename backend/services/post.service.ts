import {
  Creator,
  File,
  MembershipTier,
  Post,
  PostLikes,
  PostMediaMapping,
  User,
} from '@prisma/client';
import { safeToTransmitUser } from './user.service';

export function safeToTransmitPost(
  post: Post & {
    Files?: (PostMediaMapping & {
      File: File;
    })[];
    MinimumTier: MembershipTier | null;
    Creator: Creator & {
      User: User;
    };
    Likes: PostLikes[];
  },
) {
  return {
    ...post,
    MinimumTier: {
      name: post.MinimumTier?.name,
      currency: post.MinimumTier?.currency,
      price: post.MinimumTier?.price,
    },
    Creator: {
      ...post.Creator,
      User: safeToTransmitUser(post.Creator.User),
    },
  };
}
