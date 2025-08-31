import helpers from "../common/helpers";
import constants from "../constant/constants";

import { sql } from "../config/dbConfig";
import { IRequestCodeName, IRequestGetAllCodeName, IRequestGetPageCodeName } from "../model/common";



const CodeNameCommonServices = {
  // GET ALL
  async getAll({ transaction, data }: { transaction: any, data?: IRequestGetAllCodeName }) {
    const request = await transaction.request();

    const columnsToFilter = {
      ids: {
        columnName: "id",
        type: constants.filterColumnType.ARRAY,
      },
      codes: {
        columnName: "code",
        type: constants.filterColumnType.ARRAY,
      },
      parentCode: {
        type: constants.filterColumnType.EXACT_STRING,
      },
    };

    const filterConditions = await helpers.buildFilterConditions(
      {
        filters: {
          ids: data?.ids,
          codes: data?.codes,
          parentCode: data?.parentCode,
        },
        request: request,
        validColumns: columnsToFilter,
      }
    );

    let q = "";
    if (data?.isParent && Number(data?.isParent) === constants.booleanInt.TRUE) {
      q = "AND (parentCode IS NULL OR parentCode = '')"
    };

    request.input("status", sql.Int, constants.status.DELETED);

    let query = `SELECT * FROM CodeNameCommon WHERE 1=1 AND status != @status${q}${filterConditions}`;

    const result = await request.query(query);

    return result;
  },

  // GET PAGE
  async getPage({ transaction, data }: { transaction: any, data?: IRequestGetPageCodeName }) {
    const request = await transaction.request();

    const newValueSearchText = helpers.formatValueSearchText(data?.searchText);

    const columnsToFilter = {
      parentCode: {
        type: constants.filterColumnType.EXACT_STRING,
      },
      searchtext: {
        type: constants.filterColumnType.STRING,
      },
    };

    const filterConditions = await helpers.buildFilterConditions(
      {
        filters: {
          parentCode: data?.parentCode,
          searchtext: newValueSearchText,
        },
        request: request,
        validColumns: columnsToFilter,
      }
    );

    let q = "";
    if (data?.isParent && Number(data?.isParent) === constants.booleanInt.TRUE) {
      q = "AND (parentCode IS NULL OR parentCode = '')"
    };

    request.input("pageSize", sql.Int, data?.pageSize)
    request.input("pageNumber", sql.Int, data?.pageNumber)
    request.input("status", sql.Int, constants.status.DELETED)
    const result = await request.query(`
        SELECT *, COUNT(*) OVER() as totalCount
        FROM CodeNameCommon
        WHERE 1=1 AND status != @status ${q} ${filterConditions}
        ORDER BY id
        OFFSET (@pageNumber - 1) * @pageSize ROWS
        FETCH NEXT @pageSize ROWS ONLY;
      `);
    return result;
  },

  // GET By ParentCode
  async getByParentCode({ transaction, codes }: { transaction: any, codes?: string[] }) {
    const request = await transaction.request();

    const columnsToFilter = {
      codes: {
        columnName: "parentCode",
        type: constants.filterColumnType.ARRAY,
      },
    };

    const filterConditions = await helpers.buildFilterConditions(
      {
        filters: {
          codes: codes,
        },
        request: request,
        validColumns: columnsToFilter,
      }
    );

    const result = await request
      .input("status", sql.Int, constants.status.DELETED)
      .query(`
      SELECT *
      FROM CodeNameCommon
      WHERE 1=1 AND status != @status ${filterConditions}
    `);

    return result;
  },

  // GET DETAIL
  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    const result = await transaction.request()
      .input("id", sql.VarChar, id)
      .input("status", sql.Int, constants.status.DELETED)
      .query(`
        SELECT * FROM CodeNameCommon
        WHERE id = @id AND status != @status;
      `);

    return result;
  },

  async getByCode({ transaction, code }: { transaction: any, code: string }) {
    const result = await transaction.request()
      .input("code", sql.VarChar, code)
      .input("status", sql.Int, constants.status.DELETED)
      .query(`
        SELECT * FROM CodeNameCommon
        WHERE code = @code AND status != @status;
      `);

    return result;
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IRequestCodeName & { accountLoginId: string } }) {
    const newId = helpers.generateNumericId();

    const newValueSearchText = helpers.formatValueSearchText(`${data?.code || ""}${data?.name || ""}`);

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, newId)
      .input("code", sql.NVarChar, data?.code)
      .input("name", sql.NVarChar, data?.name)
      .input("parentCode", sql.VarChar, data?.parentCode)
      .input("description", sql.NVarChar, data?.description)
      .input("status", sql.Int, constants.status.ACTIVED)
      .input("searchtext", sql.NVarChar, newValueSearchText)
      .input("createUser", sql.VarChar, data?.accountLoginId)
      .input("createTime", sql.VarChar, helpers.currentTime(true))
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        INSERT INTO CodeNameCommon (
          id, code, name, parentCode, description,
          status, searchtext, createTime, createUser, updateTime, updateUser
        )
        OUTPUT INSERTED.id
        VALUES (
          @id, @code, @name, @parentCode, @description,
          @status, @searchtext, @createTime, @createUser, @updateTime, @updateUser
        )
      `);

    return result;
  },

  // UPDATE
  async update({ transaction, data }: { transaction: any, data: IRequestCodeName & { accountLoginId: string } }) {

    const newValueSearchText = helpers.formatValueSearchText(`${data?.code || ""}${data?.name || ""}`);

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, data?.id)
      .input("code", sql.NVarChar, data?.code)
      .input("name", sql.NVarChar, data?.name)
      .input("parentCode", sql.VarChar, data?.parentCode)
      .input("description", sql.NVarChar, data?.description)
      .input("searchtext", sql.NVarChar, newValueSearchText)
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        UPDATE CodeNameCommon
        SET
          code = @code,
          name = @name,
          searchtext = @searchtext,
          parentCode = @parentCode,
          description = @description,
          updateTime = @updateTime,
          updateUser = @updateUser
        OUTPUT
          INSERTED.id,
          INSERTED.code as n_code,
          INSERTED.name as n_name,
          INSERTED.parentCode as n_parentCode,
          INSERTED.description as n_description,
          DELETED.code as o_code,
          DELETED.name as o_name,
          DELETED.parentCode as o_parentCode,
          DELETED.description as o_description
        WHERE id = @id
      `);

    return result;
  },

  // DELETE
  async delete({ transaction, data }: { transaction: any, data: { id: string, accountLoginId: string } }) {

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, data?.id)
      .input("status", sql.Int, constants.status.DELETED)
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        UPDATE CodeNameCommon
        SET
          status = @status,
          updateTime = @updateTime,
          updateUser = @updateUser
        OUTPUT INSERTED.id
        WHERE id = @id;
      `);

    return result;
  },
};

export default CodeNameCommonServices;
