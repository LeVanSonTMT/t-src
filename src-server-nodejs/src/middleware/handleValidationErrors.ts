import { validationResult } from "express-validator";
import { errorResponse } from "../common/responseFormatter";
import constants from "../constant/constants";

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => error.msg);
    return errorResponse({
      res,
      error: `${errorMessages.join("\n")}`,
      statusCode: constants.statusCode.BAD_REQUEST,
    });
  };

  next();
};

export default handleValidationErrors;
