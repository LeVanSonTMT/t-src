import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { compareSync, hashSync } from "bcryptjs";

import helpers from "../common/helpers";
import strings from "../constant/strings";
import constants from "../constant/constants";
import jwtHelpers from "../common/jwtHelpers";
import accountActions from "../actions/accountActions";
import accountLogActions from "../actions/accountLogActions";
import reAuthAccountActions from "../actions/reAuthAccountActions";

import { IResponseAccount } from "../model/auth";
import { getConnection, sql } from "../config/dbConfig";
import { successResponse, errorResponse } from "../common/responseFormatter";



dotenv.config();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const AuthController = {

  async login(req: any, res: any) {
    const { accountCode, password } = req.body;

    try {
      const pool = await getConnection();

      const result = await accountActions.getByAccountCode({
        transaction: pool,
        accountCode: accountCode,
      });

      if (helpers.isStringEmpty(result?.id)) {
        return errorResponse({
          res,
          error: strings.auth.ACCOUNT_NOT_FOUND,
          statusCode: constants.statusCode.NOT_FOUND,
        });
      };

      const account: IResponseAccount = result;
      if (account.status != constants.status.ACTIVED) {
        return errorResponse({
          res,
          error: strings.auth.ACCOUNT_LOCKED,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

      const passwordIsValid = compareSync(password, account.password);
      if (!passwordIsValid) {
        return errorResponse({
          res,
          error: strings.auth.INVALID_PASSWORD,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };


      await reAuthAccountActions.removeReAuthAccount({
        transaction: pool,
        accountId: account.id,
      });

      const accessToken = jwtHelpers.generateAccessToken({
        accountId: account.id,
        roleCode: account.roleCode,
        fullName: account.fullName,
        accountCode: account.accountCode,
      });

      const refreshToken = jwtHelpers.generateRefreshToken({
        accountId: account.id,
        roleCode: account.roleCode,
        fullName: account.fullName,
        accountCode: account.accountCode,
      });

      successResponse({
        res,
        statusCode: constants.statusCode.SUCCESS,
        result: {
          userInfo: account,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode,
      });
    };
  },

  async refreshToken(req: any, res: any) {
    const { refreshToken } = req.body;

    if (refreshToken == null) {
      return errorResponse({
        res,
        error: strings.auth.REFRESH_TOKEN_IS_NOT_NULL,
        statusCode: constants.statusCode.BAD_REQUEST,
      });
    };

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, account: any) => {
      if (err) {
        return errorResponse({
          res,
          error: strings.auth.VERIFY_REFRESH_TOKEN,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

      const newAccessToken = jwtHelpers.generateAccessToken(account);

      successResponse({
        res,
        result: { accessToken: newAccessToken },
        statusCode: constants.statusCode.SUCCESS,
      });
    });
  },

  async changePassword(req: any, res: any) {
    const {
      accountId,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const accountLoginId = req.currentAccount?.accountId;

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const accountDetail = await accountActions.getDetail({
        id: accountId,
        transaction: transaction,
      });

      if (helpers.isStringEmpty(accountDetail?.id)) {
        return errorResponse({
          res,
          error: strings.auth.ACCOUNT_NOT_FOUND,
          statusCode: constants.statusCode.NOT_FOUND,
        });
      };

      if (accountDetail.status != constants.status.ACTIVED) {
        return errorResponse({
          res,
          error: strings.auth.ACCOUNT_LOCKED,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

      const passwordIsValid = compareSync(oldPassword, accountDetail.password);

      if (!passwordIsValid) {
        return errorResponse({
          res,
          error: strings.auth.OLD_PASSWORD_INCORRECT,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

      if (newPassword !== confirmPassword) {
        return errorResponse({
          res,
          error: strings.auth.CONFIRM_PASSWORD_INCORRECT,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

      const hashedPassword = hashSync(newPassword, Number(process.env.HASH_KEY));
      const result = await accountActions.changePassword({
        transaction,
        data: {
          id: accountId,
          password: hashedPassword,
          accountLoginId: accountLoginId,
        },
      });

      await accountLogActions.create({
        transaction,
        data: {
          accountLoginId,
          action: constants.action.UPDATE,
          targetId: accountId,
          dataChanges: JSON.stringify({
            password: {
              newValue: strings.auth.CHANGED_PASSWORD
            },
          }),
        }
      });

      if (accountLoginId !== accountId) {
        await reAuthAccountActions.addReAuthAccount({
          accountId: accountId,
          transaction: transaction,
        });
      };

      // Commit Transaction
      await transaction.commit();

      successResponse({
        res,
        result: result,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      // Rollback Transaction
      await transaction.rollback();

      errorResponse({
        res,
        error,
        statusCode: error?.statusCode
      });
    };
  },

};

export default AuthController;