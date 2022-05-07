import * as express from 'express';
import { Errors } from '../../shared/errors';
import prisma from '../prisma';
import { safeToTransmitUser } from '../services/user.service';
import { RespondError, RespondSuccess } from '../utils/response';

const creatorApp = express.Router();

creatorApp.get('/:handle', async (req, res) => {
  const { handle } = req.params;

  try {
    const creator = await prisma.creator.findFirst({
      where: {
        handle: {
          equals: handle,
          mode: 'insensitive',
        },
      },
      include: {
        User: true,
      },
    });

    if (!creator) {
      return RespondError(res, Errors.NOT_FOUND, {
        statusCode: 404,
        errorSummary: 'Creator does not exists',
      });
    }

    RespondSuccess(
      res,
      { ...creator, User: safeToTransmitUser(creator.User) },
      200,
    );
  } catch (error) {
    console.error(error);
    RespondError(res, Errors.INTERNAL, {
      statusCode: 500,
    });
  }
});

export default creatorApp;
