import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as express from 'express';
import { Errors } from '../../shared/errors';
import prisma from '../prisma';
import { safeToTransmitPost } from '../services/post.service';
import { ValidateRequest } from '../utils/request-validator';
import { RespondError, RespondSuccess } from '../utils/response';
import {
  IsCreatorLoggedIn,
  IsSubscriberLoggedIn,
} from '../utils/auth.middleware';
import multer from 'multer';
import cuid from 'cuid';
import { PostMediaMapping, Prisma } from '@prisma/client';
import { imagekit } from '../utils/imagekit';

const postApp = express.Router();

class LikeDTO {
  @IsString()
  postId!: string;
}
// Like a post
postApp.post(
  '/like',
  IsSubscriberLoggedIn,
  ValidateRequest('body', LikeDTO),
  async (req, res) => {
    try {
      const { postId } = req.body as LikeDTO;
      const subscriberId = req.session.user?.Subscriber?.id!;

      // Check if already liked
      const liked = await prisma.postLikes.findUnique({
        where: {
          postId_subscriberId: {
            postId,
            subscriberId,
          },
        },
      });

      if (liked) {
        return RespondSuccess(res, null, 200);
      }

      // Create new like
      await prisma.postLikes.create({
        data: {
          postId,
          subscriberId,
        },
      });

      RespondSuccess(res, null, 200);
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.LIKE_FAILED, {
        statusCode: 400,
      });
    }
  },
);

class UnLikeDTO {
  @IsString()
  postId!: string;
}
// UnLike a post
postApp.delete(
  '/like',
  IsSubscriberLoggedIn,
  ValidateRequest('body', UnLikeDTO),
  async (req, res) => {
    try {
      const { postId } = req.body as LikeDTO;
      const subscriberId = req.session.user?.Subscriber?.id!;

      // Check if already liked
      const liked = await prisma.postLikes.findFirst({
        where: {
          postId,
          subscriberId,
        },
      });

      if (!liked) {
        return RespondSuccess(res, null, 200);
      }

      // Create new like
      await prisma.postLikes.delete({
        where: {
          postId_subscriberId: {
            postId,
            subscriberId,
          },
        },
      });

      RespondSuccess(res, null, 200);
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.LIKE_FAILED, {
        statusCode: 400,
        errorSummary: 'Failed to remove like',
      });
    }
  },
);

class PaginationDTO {
  @IsOptional()
  @Transform(({ value }) => {
    let int = parseInt(value, 10);
    if (Number.isNaN(int)) int = 20;
    return int;
  })
  take?: number;

  @IsOptional()
  @Transform(({ value }) => {
    let int = parseInt(value, 10);
    if (Number.isNaN(int)) int = 0;
    return int;
  })
  skip?: number;
}

postApp.get(
  '/by-creator/:creatorId',
  ValidateRequest('query', PaginationDTO),
  async (req, res) => {
    const { creatorId } = req.params;
    const { take = 20, skip = 0 } = req.query as PaginationDTO;

    // Check if we should include current user's likes
    const subscriberId = req.session.user?.Subscriber?.id;
    let includeLikes: Prisma.PostLikesFindManyArgs | boolean = false;
    if (subscriberId) {
      includeLikes = {
        where: { subscriberId },
        take: 1,
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { creatorId },
        include: {
          Files: {
            include: {
              File: true,
            },
          },
          MinimumTier: true,
          Creator: {
            include: {
              User: true,
            },
          },
          Likes: includeLikes,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      prisma.post.count({
        where: { creatorId },
      }),
    ]);

    const result = posts.map(safeToTransmitPost);

    RespondSuccess(res, { posts: result, total }, 200);
  },
);

class CreatePostDTO {
  @IsString()
  text!: string;
}

// Create post
postApp.post(
  '/',
  IsCreatorLoggedIn,
  multer().array('files', 5),
  ValidateRequest('body', CreatePostDTO),
  async (req, res) => {
    try {
      // Getting data from request
      const { text } = req.body as CreatePostDTO;
      const files = req.files as Express.Multer.File[];

      // Pre-generate a post id for later use
      const postId = cuid();

      // Upload files to image kit
      const fileRecords = await Promise.all(
        files.map(async (file): Promise<Prisma.FileCreateManyInput> => {
          // The folder where post files (media) will be uploaded
          const folder = 'post-media';

          // Uploading...
          const response = await imagekit.upload({
            file: file.buffer,
            fileName: postId,
            folder,
          });

          // Generating a file record object in memory for now
          return {
            id: cuid(),
            link: `${folder}/${response.name}`,
            mimeType: file.mimetype,
            uploaderUserId: req.session.user?.id!,
          };
        }),
      );

      // Creating files in bulk
      await prisma.file.createMany({
        data: fileRecords,
      });

      // Creating Post media mapping objects for later use
      const postMediaMappings = fileRecords.map(
        (file): Partial<PostMediaMapping> => {
          return {
            fileId: file.id!,
          };
        },
      );

      // Create the actual post
      const post = await prisma.post.create({
        data: {
          id: postId,
          text,
          creatorId: req.session.user?.Creator?.id!,
          // Associate the uploaded files in one go
          Files: {
            createMany: {
              data: postMediaMappings.map((pmm) => ({
                fileId: pmm.fileId!,
              })),
            },
          },
        },
        include: {
          Files: {
            include: {
              File: true,
            },
          },
          MinimumTier: true,
          Creator: true,
        },
      });

      RespondSuccess(res, post, 200);
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.POST_CREATION_FAILED, {
        statusCode: 500,
        errorSummary: 'Failed to create post',
        data: (error as any)?.message,
      });
    }
  },
);

// Get one post
postApp.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if we should include current user's likes
    const subscriberId = req.session.user?.Subscriber?.id;
    let includeLikes: Prisma.PostLikesFindManyArgs | boolean = false;
    if (subscriberId) {
      includeLikes = {
        where: { subscriberId },
        take: 1,
      };
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        Files: {
          include: {
            File: true,
          },
        },
        MinimumTier: true,
        Creator: {
          include: {
            User: true,
          },
        },
        Likes: includeLikes,
      },
    });

    if (!post) {
      return RespondError(res, Errors.NOT_FOUND, {
        statusCode: 404,
        errorSummary: 'Post not found',
      });
    }

    RespondSuccess(res, safeToTransmitPost(post), 200);
  } catch (error) {
    console.error(error);
    RespondError(res, Errors.INTERNAL, {
      statusCode: 500,
    });
  }
});

export default postApp;
