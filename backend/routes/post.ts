import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as express from 'express';
import { Errors } from '../../shared/errors';
import prisma from '../prisma';
import { safeToTransmitPost } from '../services/post.service';
import { ValidateRequest } from '../utils/request-validator';
import { RespondError, RespondSuccess } from '../utils/response';
import { IsCreatorLoggedIn } from '../utils/auth.middleware';

const postApp = express.Router();

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
  ValidateRequest('body', CreatePostDTO),
  async (req, res) => {
    try {
      const { text } = req.body as CreatePostDTO;

      const post = await prisma.post.create({
        data: {
          text,
          creatorId: req.session.user?.Creator?.id!,
        },
      });

      RespondSuccess(res, post, 200);
    } catch (error) {
      console.error(error);
      RespondError(res, Errors.INTERNAL, {
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
