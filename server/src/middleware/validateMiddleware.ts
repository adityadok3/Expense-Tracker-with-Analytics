import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "../utils/apiResponse";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return ApiResponse.error(res, "Validation failed", formattedErrors, 400);
    }
    req.body = result.data;
    next();
  };
};
