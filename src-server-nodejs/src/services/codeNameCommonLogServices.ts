import helpers from "../common/helpers";
import constants from "../constant/constants";

import { sql } from "../config/dbConfig";
import { IRequestCreateLogs, IRequestGetPageLogs } from "../model/common";



const CodeNameCommonLogServices = {
  // GET PAGE
  async getPage({ transaction, data }: { transaction: any, data: IRequestGetPageLogs }) {
    const request = await transaction.request();

    const columnsToFilter = {
      action: {
        type: constants.filterColumnType.NUMBER,
      },
      codenameId: {
        type: constants.filterColumnType.EXACT_STRING,
      },
      createUser: {
        type: constants.filterColumnType.EXACT_STRING,
      },
      createTime: {
        type: constants.filterColumnType.DATE,
      },
    };

    const newAction = data?.action ? Number(data?.action) : undefined;

    const filterConditions = await helpers.buildFilterConditions(
      {
        filters: {
          action: newAction,
          codenameId: data?.targetId,
          createUser: data?.byUser,
          createTime: {
            endTime: data?.endTime,
            startTime: data?.startTime,
          }
        },
        request: request,
        validColumns: columnsToFilter,
      }
    );

    request.input("pageSize", sql.Int, data?.pageSize)
    request.input("pageNumber", sql.Int, data?.pageNumber)

    const query = `
        SELECT *, COUNT(*) OVER() as totalCount
        FROM CodeNameCommonLog
        WHERE 1=1 ${filterConditions}
        ORDER BY createTime DESC
        OFFSET (@pageNumber - 1) * @pageSize ROWS
        FETCH NEXT @pageSize ROWS ONLY;
      `;

    const result = await request.query(query);

    return result;
  },

  // GET DETAIL
  async getDetail({ transaction, id }: { transaction: any, id: string }) {
    const result = await transaction.request()
      .input("id", sql.VarChar, id)
      .query(`
        SELECT * FROM CodeNameCommonLog
        WHERE id = @id;
      `);
    return result;
  },

  // CREATE
  async create({ transaction, data }: { transaction: any, data: IRequestCreateLogs & { accountLoginId: string } }) {
    const newId = helpers.generateNumericId();

    const request = new sql.Request(transaction);

    const result = await request
      .input("id", sql.VarChar, newId)
      .input("action", sql.Int, data?.action)
      .input("codenameId", sql.VarChar, data?.targetId)
      .input("dataChanges", sql.NVarChar, data?.dataChanges)
      .input("createUser", sql.VarChar, data?.accountLoginId)
      .input("createTime", sql.VarChar, helpers.currentTime(true))
      .query(`
        INSERT INTO CodeNameCommonLog (
           id, codenameId, action, dataChanges, createTime, createUser
        )
        OUTPUT INSERTED.id
        VALUES (
          @id, @codenameId, @action, @dataChanges, @createTime, @createUser
        )
      `);

    return result;
  },

};

export default CodeNameCommonLogServices;
