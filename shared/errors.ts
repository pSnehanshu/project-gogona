export enum Errors {
  LOGIN_FAILED = "Login failed",
  VALIDATION_FAILED = "Validation failed",
}

export type ErrorResponse = {
  statusCode: number;
  type: Errors;
  message: string;
  details: null | Record<string, any>;
};
