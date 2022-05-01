import { Response } from "express";
import { Errors, ErrorResponse } from "../../shared/errors";

export function generateErrorResponse(
  errorType: Errors,
  statusCode: number,
  options?: { errorSummary?: string; details?: Record<string, any> }
): ErrorResponse {
  return {
    statusCode: statusCode,
    type: errorType,
    message: options?.errorSummary ?? "Something went wrong",
    details: options?.details ?? null,
  };
}

export function RespondError(
  res: Response,
  errorType: Errors,
  options?: {
    statusCode?: number;
    errorSummary?: string;
    details?: Record<string, any>;
  }
) {
  const code = options?.statusCode ?? 500;
  return res.status(code).json(
    generateErrorResponse(errorType, code, {
      errorSummary: options?.errorSummary,
      details: options?.details,
    })
  );
}
