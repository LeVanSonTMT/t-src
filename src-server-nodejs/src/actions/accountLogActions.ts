import strings from "../constant/strings";
import HttpError from "../common/httpError";
import constants from "../constant/constants";
import accountLogServices from "../services/accountLogServices";

import { IRequestCreateLogs, IRequestGetPageLogs } from "../model/common";



const AccountLogActions = {
  // GET PAGE
  async getPage({ transaction, data }: { transaction: any, data: IRequestGetPageLogs }) {
    try {

      const result = await accountLogServices.getPage({ transaction, data });

      return {
        result: result.recordset,
        totalCount: result.recordset?.[0]?.totalCount,
      };
    } catch (error) {
      throw error;
    };
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IRequestCreateLogs & { accountLoginId: string } }) {
    try {

      const result = await accountLogServices.create({
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

export default AccountLogActions;
