import strings from "../constant/strings";
import HttpError from "../common/httpError";
import constants from "../constant/constants";
import codeNameCommonServices from "../services/codeNameCommonServices";

import { IRequestCodeName, IRequestGetPageCodeName, IRequestGetAllCodeName } from "../model/common";


const CodeNameCommonActions = {
  async getAll({ transaction, data }: { transaction: any, data?: IRequestGetAllCodeName }) {
    try {
      const result = await codeNameCommonServices.getAll({
        data,
        transaction,
      });

      return result.recordset;
    } catch (error) {
      throw error;
    };
  },

  async getPage({ transaction, data }: { transaction: any, data: IRequestGetPageCodeName }) {
    try {

      const result = await codeNameCommonServices.getPage({
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

  async getByParentCode({ transaction, codes }: { transaction: any, codes?: string[] }) {
    try {
      const result = await codeNameCommonServices.getByParentCode({
        codes,
        transaction,
      });

      return result.recordset;
    } catch (error) {
      throw error;
    };
  },

  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    try {

      const result = await codeNameCommonServices.getDetail({
        id,
        transaction,
      });

      return result.recordset?.[0];
    } catch (error) {
      throw error;
    };
  },

  async getByCode({ transaction, code }: { transaction: any, code: string }) {
    try {

      const result = await codeNameCommonServices.getByCode({
        code,
        transaction,
      });

      return result.recordset?.[0];
    } catch (error) {
      throw error;
    };
  },

  async create({ transaction, data }: { transaction: any, data: IRequestCodeName & { accountLoginId: string } }) {
    try {

      const result = await codeNameCommonServices.create({
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

  async update({ transaction, data }: { transaction: any, data: IRequestCodeName & { accountLoginId: string } }) {
    try {

      const result = await codeNameCommonServices.update({
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

  async delete({ transaction, data }: { transaction: any, data: { id: string, accountLoginId: string } }) {
    try {

      const result = await codeNameCommonServices.delete({
        data,
        transaction,
      });

      if (result.rowsAffected[0] <= 0) {
        throw new HttpError(strings.common.SERVER_ERROR, constants.statusCode.INTERNAL_SERVER_ERROR);
      };

      const { id } = result.recordset?.[0] || {};

      return id;
    } catch (error) {
      throw error;
    };
  },

};

export default CodeNameCommonActions;
