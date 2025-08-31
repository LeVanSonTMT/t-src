import strings from "../constant/strings";
import HttpError from "../common/httpError";
import constants from "../constant/constants";
import codeNameCommonLogServices from "../services/codeNameCommonLogServices";

import { IRequestCreateLogs, IRequestGetPageLogs } from "../model/common";


const CodeNameCommonLogActions = {
  async getPage({ transaction, data }: { transaction: any, data: IRequestGetPageLogs }) {
    try {

      const result = await codeNameCommonLogServices.getPage({ transaction, data });

      return {
        result: result.recordset,
        totalCount: result.recordset?.[0]?.totalCount,
      };
    } catch (error) {
      throw error;
    };
  },

  async create({ transaction, data }: { transaction: any, data: IRequestCreateLogs & { accountLoginId: string } }) {
    try {

      const result = await codeNameCommonLogServices.create({
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

export default CodeNameCommonLogActions;
