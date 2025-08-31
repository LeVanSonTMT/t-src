import helpers from "../common/helpers";
import strings from "../constant/strings";
import constants from "../constant/constants";
import codeNameCommonActions from "../actions/codeNameCommonActions";
import codeNameCommonLogActions from "../actions/codeNameCommonLogActions";

import { sql, getConnection } from "../config/dbConfig";
import { IDataChanges, IGetPaged } from "../model/common";
import { errorResponse, successResponse } from "../common/responseFormatter";



const CodeNameCommonController = {

  async getAll(req: any, res: any) {
    const { codes, isParent, parentCode } = req.query;

    try {
      const pool = await getConnection();

      const result = await codeNameCommonActions.getAll({
        data: {
          codes,
          parentCode,
          isParent: !helpers.isNullOrEmpty(isParent) ? Number(isParent) : undefined,
        },
        transaction: pool,
      });

      successResponse({
        res,
        result: result,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode
      });
    };
  },

  async getPage(req: any, res: any) {
    const { isParent, parentCode, searchText, pageSize, pageNumber } = req.query;

    try {
      const pool = await getConnection();

      const newIsParent = !helpers.isNullOrEmpty(isParent) ? Number(isParent) : undefined;
      const newPageSize = Number(pageSize || constants.pageSize);
      const newPageNumber = Number(pageNumber || constants.pageNumber);

      const result = await codeNameCommonActions.getPage({
        transaction: pool,
        data: {
          parentCode,
          searchText,
          isParent: newIsParent,
          pageSize: newPageSize,
          pageNumber: newPageNumber,
        },
      });

      const totalPages = Math.ceil(result.totalCount / newPageSize);

      const dataResult: IGetPaged = {
        pageSize: newPageSize,
        currentPage: newPageNumber,

        totalPages: totalPages,
        totalCounts: result.totalCount,

        hasNext: newPageNumber < totalPages,
        hasPrevious: newPageNumber > 1 && totalPages > 1,

        items: [...result.result || []],
        selectedItems: [],
      };

      successResponse({
        res,
        result: dataResult,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode,
      });
    };
  },

  async getByParentCode(req: any, res: any) {
    const { codes } = req.query;

    try {
      const pool = await getConnection();

      const result = await codeNameCommonActions.getByParentCode({
        codes: codes,
        transaction: pool,
      });

      successResponse({
        res,
        result: result,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode
      });
    };
  },

  async getDetail(req: any, res: any) {
    const id = req.params.id;

    if (helpers.isStringEmpty(id)) {
      errorResponse({
        res,
        error: strings.common.ID_NOT_FOUND,
        statusCode: constants.statusCode.NOT_FOUND,
      });
      return;
    };

    try {
      const pool = await getConnection();

      const result = await codeNameCommonActions.getDetail({
        transaction: pool,
        id: id,
      });

      successResponse({
        res,
        result: result,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode,
      });
    };
  },

  async create(req: any, res: any) {
    const accountLoginId = req.currentAccount?.accountId;
    const { code, name, parentCode, description } = req.body;

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const resultDetail = await codeNameCommonActions.getByCode({
        code: code,
        transaction,
      });

      if (helpers.isNullOrEmpty(resultDetail?.id)) {
        // create
        const result = await codeNameCommonActions.create({
          transaction,
          data: { code, name, description, parentCode, accountLoginId },
        });

        // log recording create
        const newDataChanges: IDataChanges = {
          code: { newValue: code },
          name: { newValue: name },
          parentCode: { newValue: parentCode },
          description: { newValue: description },
        };
        await codeNameCommonLogActions.create({
          transaction,
          data: {
            accountLoginId,
            action: constants.action.CREATE,
            targetId: result,
            dataChanges: JSON.stringify(newDataChanges),
          }
        });

        // Commit Transaction
        await transaction.commit();

        successResponse({
          res,
          result: result,
          statusCode: constants.statusCode.SUCCESS,
        });
      } else {
        // Commit Transaction
        await transaction.commit();

        errorResponse({
          res,
          error: strings.error_validate.CODE_NAME_ALREADY_EXISTS,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };
    } catch (error: any) {
      // Rollback Transaction
      await transaction.rollback();

      errorResponse({
        res,
        error,
        statusCode: error?.statusCode,
      });
    };
  },

  async update(req: any, res: any) {
    const accountLoginId = req.currentAccount?.accountId;
    const { id, code, name, parentCode, description, updateTime } = req.body;

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const resultDetail = await codeNameCommonActions.getByCode({
        code: code,
        transaction,
      });

      if (helpers.isNullOrEmpty(resultDetail?.id) || (resultDetail?.id === id)) {
        // update

        const result = await codeNameCommonActions.update({
          transaction,
          data: {
            id, code, name, description,
            parentCode, updateTime, accountLoginId
          },
        });

        if (result?.n_code !== result?.o_code) {
          const resultCodeNameChilds = await codeNameCommonActions.getAll({
            transaction: transaction,
            data: { parentCode: code },
          });

          for (const element of [...resultCodeNameChilds || []]) {
            await codeNameCommonActions.update({
              transaction,
              data: {
                parentCode: code,
                id: element.id,
                code: element.code,
                name: element.name,
                updateTime: element.updateTime,
                description: element.description,
                accountLoginId,
              },
            });
          };
        };

        //#region log recording update
        let newDataChanges: IDataChanges = {};

        if (result?.n_code && result?.n_code !== result?.o_code) {
          newDataChanges = {
            ...newDataChanges,
            code: { newValue: result?.n_code, oldValue: result?.o_code },
          };
        };
        if (result?.n_name && result?.n_name !== result?.o_name) {
          newDataChanges = {
            ...newDataChanges,
            name: { newValue: result?.n_name, oldValue: result?.o_name },
          };
        };
        if (result?.n_parentCode && result?.n_parentCode !== result?.o_parentCode) {
          newDataChanges = {
            ...newDataChanges,
            parentCode: { newValue: result?.n_parentCode, oldValue: result?.o_parentCode },
          };
        };
        if (result?.n_description && result?.n_description !== result?.o_description) {
          newDataChanges = {
            ...newDataChanges,
            description: { newValue: result?.n_description, oldValue: result?.o_description },
          };
        };

        if (Object.keys(newDataChanges).length > 0) {
          await codeNameCommonLogActions.create({
            transaction,
            data: {
              accountLoginId,
              action: constants.action.UPDATE,
              targetId: id,
              dataChanges: JSON.stringify(newDataChanges),
            }
          });
        };
        //#endregion log recording update

        // Commit Transaction
        await transaction.commit();

        successResponse({
          res,
          result: result,
          statusCode: constants.statusCode.SUCCESS,
        });
      } else {
        // Commit Transaction
        await transaction.commit();

        errorResponse({
          res,
          error: strings.error_validate.CODE_NAME_ALREADY_EXISTS,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      };

    } catch (error: any) {
      // Rollback Transaction
      await transaction.rollback();

      errorResponse({
        res,
        error,
        statusCode: error?.statusCode,
      });
    };
  },

  async delete(req: any, res: any) {
    const id = req.params.id;
    const { code } = req.query;

    const accountLoginId = req.currentAccount?.accountId;

    if (helpers.isStringEmpty(id)) {
      errorResponse({
        res,
        error: strings.common.ID_NOT_FOUND,
        statusCode: constants.statusCode.NOT_FOUND,
      });
      return;
    };

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // delete list codename child
      if (!helpers.isStringEmpty(code)) {
        const resultCodeNameChilds = await codeNameCommonActions.getAll({
          transaction: transaction,
          data: { parentCode: code },
        });

        if (resultCodeNameChilds && [...resultCodeNameChilds || []].length > 0) {
          for (const element of [...resultCodeNameChilds || []]) {
            await codeNameCommonActions.delete({
              transaction,
              data: { id: element.id, accountLoginId },
            });
          }
        };
      }

      // delete
      const result = await codeNameCommonActions.delete({
        transaction,
        data: { id, accountLoginId },
      });

      // // log recording delete
      await codeNameCommonLogActions.create({
        transaction,
        data: {
          accountLoginId,
          action: constants.action.DELETE,
          targetId: id,
          dataChanges: "",
        }
      });

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

  async getPageLogs(req: any, res: any) {
    const { pageSize, pageNumber, startTime, endTime, byUser, action, codenameId } = req.query;

    try {
      const pool = await getConnection();

      const newPageSize = Number(pageSize || constants.pageSize);
      const newPageNumber = Number(pageNumber || constants.pageNumber);

      const result = await codeNameCommonLogActions.getPage({
        transaction: pool,
        data: {
          action: action,
          byUser: byUser,
          endTime: endTime,
          startTime: startTime,

          targetId: codenameId,
          pageSize: newPageSize,
          pageNumber: newPageNumber,
        },
      });

      const totalPages = Math.ceil(result.totalCount / newPageSize);

      const dataResult: IGetPaged = {
        pageSize: newPageSize,
        currentPage: newPageNumber,

        totalPages: totalPages,
        totalCounts: result.totalCount,

        hasNext: newPageNumber < totalPages,
        hasPrevious: newPageNumber > 1 && totalPages > 1,

        items: [...result.result || []],
        selectedItems: [],
      };

      successResponse({
        res,
        result: dataResult,
        statusCode: constants.statusCode.SUCCESS,
      });
    } catch (error: any) {
      errorResponse({
        res,
        error,
        statusCode: error?.statusCode
      });
    };
  },

};

export default CodeNameCommonController;