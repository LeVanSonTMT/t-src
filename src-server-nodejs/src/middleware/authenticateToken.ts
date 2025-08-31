import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import strings from "../constant/strings";
import constants from "../constant/constants";
import reAuthAccountActions from "../actions/reAuthAccountActions";

import { IRequestAccountByJWT } from "../model/auth";
import { errorResponse } from "../common/responseFormatter";

dotenv.config();

const secretKey = process.env.SECRET_KEY || "";

const authenticateToken = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return errorResponse({
        res,
        error: strings.auth.ACCESS_DENIED,
        statusCode: constants.statusCode.NOT_PERMISSION,
      });
    };

    jwt.verify(token, secretKey, async (err: any, account: any) => {
      if (err) {
        return errorResponse({
          res,
          error: strings.auth.TOKEN_EXPIRED,
          statusCode: constants.statusCode.TOKEN_EXPIRED,
        });
      };

      const { accountId, roleCode }: IRequestAccountByJWT = account;

      // Check if accountId is in cache
      const checked = await reAuthAccountActions.isAccountInCacheRedis(accountId);
      if (checked) {
        return errorResponse({
          res,
          error: strings.auth.TOKEN_EXPIRED,
          statusCode: constants.statusCode.TOKEN_EXPIRED,
        });
      };

      // Check Roles
      if (roles.length && !roles.includes(roleCode)) {
        return errorResponse({
          res,
          error: strings.auth.ACCESS_DENIED,
          statusCode: constants.statusCode.NOT_PERMISSION,
        });
      };

      req.currentAccount = account;
      next();
    });
  };
};

export default authenticateToken;