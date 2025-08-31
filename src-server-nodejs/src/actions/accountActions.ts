import strings from "../constant/strings";
import HttpError from "../common/httpError";
import constants from "../constant/constants";
import accountServices from "../services/accountServices";

import { IRequestCreateAcount, IRequestUpdateAcount, IRequestGetPageAccount } from "../model/auth";



const AccountActions = {
  async getByIds({ transaction, data }: {
    transaction: any,
    data: {
      ids?: string[];
      onlyName?: number;
    },
  }) {
    try {

      const result = await accountServices.getByIds({
        data,
        transaction,
      });

      return result.recordset;
    } catch (error) {
      throw error;
    };
  },

  async getPage({ transaction, data }: { transaction: any, data: IRequestGetPageAccount }) {
    try {

      const result = await accountServices.getPage({
        data,
        transaction,
      });

      return {
        result: result.recordset,
        totalCount: result.recordset?.[0]?.totalCount,
      };
    } catch (error) {
      throw error;
    };
  },

  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    try {

      const result = await accountServices.getDetail({
        id,
        transaction,
      });

      return result.recordset?.[0];
    } catch (error) {
      throw error;
    };
  },

  async getByAccountCode({ transaction, accountCode }: { transaction: any, accountCode: string }) {
    try {

      const result = await accountServices.getByAccountCode({
        accountCode,
        transaction,
      });

      return result.recordset?.[0];
    } catch (error) {
      throw error;
    };
  },

  async create({ transaction, data }: { transaction: any, data: IRequestCreateAcount.IService & { accountLoginId: string } }) {
    try {

      const result = await accountServices.create({
        data,
        transaction,
      });

      if (result.rowsAffected?.[0] <= 0) {
        throw new HttpError(strings.common.SERVER_ERROR, constants.statusCode.INTERNAL_SERVER_ERROR);
      };

      const { id } = result.recordset?.[0] || {};

      return id;
    } catch (error) {
      throw error;
    };
  },

  async update({ transaction, data }: { transaction: any, data: IRequestUpdateAcount.IService & { accountLoginId: string } }) {
    try {

      const result = await accountServices.update({
        data,
        transaction,
      });

      if (result.rowsAffected?.[0] <= 0) {
        throw new HttpError(strings.common.SERVER_ERROR, constants.statusCode.INTERNAL_SERVER_ERROR);
      };

      return result.recordset?.[0] || {};
    } catch (error) {
      throw error;
    };
  },

  async changePassword({ transaction, data }: { transaction: any, data: { id: string, password: string, accountLoginId: string } }) {
    try {

      const result = await accountServices.changePassword({
        data,
        transaction,
      });

      if (result.rowsAffected?.[0] <= 0) {
        throw new HttpError(strings.common.SERVER_ERROR, constants.statusCode.INTERNAL_SERVER_ERROR);
      };

      const { id } = result.recordset?.[0] || {};

      return id;
    } catch (error) {
      throw error;
    };
  },

  async delete({ transaction, data }: { transaction: any, data: { id: string, accountLoginId: string } }) {
    try {

      const result = await accountServices.delete({
        data,
        transaction,
      });

      if (result.rowsAffected?.[0] <= 0) {
        throw new HttpError(strings.common.SERVER_ERROR, constants.statusCode.INTERNAL_SERVER_ERROR);
      };

      const { id } = result.recordset?.[0] || {};

      return id;
    } catch (error) {
      throw error;
    };
  },

};

export default AccountActions;
