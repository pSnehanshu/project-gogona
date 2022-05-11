import { NextFunction, Request, Response } from 'express';
import { Errors } from '../../shared/errors';
import { RespondError } from './response';

export function IsLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    next();
  } else {
    RespondError(res, Errors.UNAUTHORIZED, {
      statusCode: 401,
      errorSummary: 'You must be logged in',
    });
  }
}

export function IsCreatorLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session?.user && req.session?.user?.Creator) {
    next();
  } else {
    RespondError(res, Errors.UNAUTHORIZED, {
      statusCode: 401,
      errorSummary: 'You must be logged in as a creator',
    });
  }
}

export function IsSubscriberLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session?.user && req.session?.user?.Subscriber) {
    next();
  } else {
    RespondError(res, Errors.UNAUTHORIZED, {
      statusCode: 401,
      errorSummary: 'You must be logged in as a subscriber',
    });
  }
}
