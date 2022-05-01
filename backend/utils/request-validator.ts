import type { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import _ from "lodash";
import { RespondError } from "./response";
import { Errors } from "../../shared/errors";

declare type Class<T = any> = new (...args: any[]) => T;

export const ValidateBody =
  (schema: Class<Record<string, any>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Create object
    const { body } = req;
    const validatedBody = new schema();

    // Build the schema object
    if (typeof body === "object" && body !== null && !Array.isArray(body)) {
      Object.keys(body).forEach((key) => {
        if (Object.hasOwn(body, key)) {
          validatedBody[key] = body[key];
        }
      });
    }

    // Validate
    const errors = await validate(validatedBody, {
      forbidUnknownValues: true,
    });

    // Check if there are errors
    if (errors.length > 0) {
      return RespondError(res, Errors.VALIDATION_FAILED, {
        statusCode: 400,
        errorSummary: "You have provided invalid input",
        data: errors.map((e) => _.pick(e, ["property", "constraints"])),
      });
    }

    // No errors, proceed
    return next();
  };
