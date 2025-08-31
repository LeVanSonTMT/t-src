import { sql } from "../config/dbConfig";

import helpers from "../common/helpers";
import constants from "../constant/constants";

import { IRequestCreateAcount, IRequestGetPageAccount, IRequestUpdateAcount } from "../model/auth";

const AccountServices = {
  // GET LIST BY IDS
  async getByIds({ transaction, data }: {
    transaction: any,
    data: {
      ids?: string[];
      onlyName?: number;
    },
  }) {
    const request = await transaction.request();

    const columnsToFilter = {
      ids: {
        alias: "u",
        columnName: "id",
        type: constants.filterColumnType.ARRAY,
      },
    };

    const filterConditions = await helpers.buildFilterConditions(
      {
        request: request,
        filters: { ids: data?.ids },
        validColumns: columnsToFilter,
      }
    );

    let query = `SELECT * FROM Account WHERE 1=1 AND status != @status ${filterConditions}`;
    if (Number(data?.onlyName) === constants.booleanInt.TRUE) {
      query = `
        SELECT id, fullName, accountCode
        FROM Account
        WHERE 1=1 AND status != @status ${filterConditions}
      `;
    };

    request.input("status", sql.Int, constants.status.DELETED);
    const result = await request.query(query);

    return result;
  },

  // GET PAGE
  async getPage({ transaction, data }: { transaction: any, data?: IRequestGetPageAccount }) {
    const request = await transaction.request();

    const newValueSearchText = helpers.formatValueSearchText(data?.searchText);

    const columnsToFilter = {
      departmentId: {
        alias: "a",
        type: constants.filterColumnType.EXACT_STRING,
      },
      searchtext: {
        alias: "a",
        type: constants.filterColumnType.STRING,
      },
    };

    const filterConditions = await helpers.buildFilterConditions(
      {
        filters: {
          searchtext: newValueSearchText,
          departmentId: data?.departmentId,
        },
        request: request,
        validColumns: columnsToFilter,
      }
    );

    request.input("pageSize", sql.Int, data?.pageSize)
    request.input("pageNumber", sql.Int, data?.pageNumber)
    request.input("status", sql.Int, constants.status.DELETED)

    const result = await request.query(`
        SELECT
          a.id,
          a.fullName,
          a.accountCode,
          r.name as roleName,
          a.status,
          a.createTime, a.createUser,
          a.updateTime, a.updateUser,
          COUNT(*) OVER() as totalCount
        FROM Account AS a
        WHERE
          1=1
          AND a.status != @status
          ${filterConditions}
        ORDER BY a.id
        OFFSET (@pageNumber - 1) * @pageSize ROWS
        FETCH NEXT @pageSize ROWS ONLY;
      `);
    return result;
  },

  // GET DETAIL
  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    const result = await transaction.request()
      .input("id", sql.VarChar, id)
      .input("status", sql.Int, constants.status.DELETED)
      .query(`
        SELECT a.*
        FROM Account as a
        WHERE a.id = @id AND a.status != @status;
      `);

    return result;
  },

  // GET BY ACCOUNT CODE
  async getByAccountCode({ transaction, accountCode }: { transaction: any, accountCode: string }) {
    const result = await transaction.request()
      .input("accountCode", sql.VarChar, accountCode)
      .input("status", sql.Int, constants.status.DELETED)
      .query(`
          SELECT * FROM Account
          WHERE accountCode = @accountCode AND status != @status;
        `);
    return result;
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IRequestCreateAcount.IService & { accountLoginId: string } }) {
    const newId = helpers.generateNumericId();

    const newValueSearchText = helpers.formatValueSearchText(`${data?.accountCode || ""}${data?.fullName || ""}`);

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, newId)
      .input("password", sql.VarChar, data?.password)
      .input("fullName", sql.NVarChar, data?.fullName)
      .input("roleCode", sql.NVarChar, data?.roleCode)
      .input("accountCode", sql.VarChar, data?.accountCode)
      .input("needChangePW", sql.Int, constants.booleanInt.FALSE)
      .input("status", sql.Int, constants.status.ACTIVED)
      .input("searchtext", sql.NVarChar, newValueSearchText)
      .input("createUser", sql.VarChar, data?.accountLoginId)
      .input("createTime", sql.VarChar, helpers.currentTime(true))
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        INSERT INTO Account (
          id, fullName, accountCode, password, roleCode, needChangePW,
          status, searchtext, createTime, createUser, updateTime, updateUser
        )
        OUTPUT INSERTED.id
        VALUES (
          @id, @fullName, @accountCode, @password, @roleCode, @needChangePW,
          @status, @searchtext, @createTime, @createUser, @updateTime, @updateUser
        )
      `);

    return result;
  },

  // UPDATE
  async update({ transaction, data }: { transaction: any, data: IRequestUpdateAcount.IService & { accountLoginId: string } }) {

    const newValueSearchText = helpers.formatValueSearchText(`${data?.accountCode || ""}${data?.fullName || ""}`);

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, data?.id)
      .input("roleCode", sql.NVarChar, data?.roleCode)
      .input("fullName", sql.NVarChar, data?.fullName)
      .input("accountCode", sql.VarChar, data?.accountCode)
      .input("searchtext", sql.NVarChar, newValueSearchText)
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        UPDATE Account
        SET
          roleCode = @roleCode,
          fullName = @fullName,
          accountCode = @accountCode,
          searchtext = @searchtext,
          updateTime = @updateTime,
          updateUser = @updateUser
        OUTPUT
          INSERTED.id,
          INSERTED.roleCode as n_roleCode,
          INSERTED.fullName as n_fullName,
          INSERTED.accountCode as n_accountCode,
          DELETED.roleCode as o_roleCode,
          DELETED.fullName as o_fullName,
          DELETED.accountCode as o_accountCode
        WHERE id = @id
      `);

    return result;
  },

  // CHANGE PASSWORD
  async changePassword({ transaction, data }: { transaction: any, data: { id: string, password: string, accountLoginId: string } }) {

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, data?.id)
      .input("password", sql.VarChar, data?.password)
      .input("needChangePW", sql.Int, constants.booleanInt.TRUE)
      .input("updateUser", sql.VarChar, data?.accountLoginId)
      .input("updateTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        UPDATE Account
        SET
          password = @password,
          updateTime = @updateTime,
          updateUser = @updateUser,
          needChangePW = @needChangePW
        OUTPUT INSERTED.id
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
        UPDATE Account
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

export default AccountServices;
