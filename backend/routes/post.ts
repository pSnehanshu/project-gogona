import * as express from 'express';
import { Errors } from '../../shared/errors';
import prisma from '../prisma';
import { safeToTransmitPost } from '../services/post.service';
import { RespondError, RespondSuccess } from '../utils/response';

const postApp = express.Router();

postApp.get('/by-creator/:creatorId', async (req, res) => {
  const { creatorId } = req.params;

  const posts = await prisma.post.findMany({
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
  });

  const result = posts.map(safeToTransmitPost);

  RespondSuccess(res, result, 200);
});

export default postApp;
