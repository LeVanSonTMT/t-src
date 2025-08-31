import helpers from "../common/helpers";
import { sql } from "../config/dbConfig";

const ReAuthAccountServices = {
  getReAuthAccount: async ({ transaction }: { transaction: any }) => {
    const result = await transaction
      .request()
      .query("SELECT * FROM ReAuthAccount");

    return result;
  },

  addReAuthAccount: async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
    const newId = helpers.generateNumericId();

    // Check if accountId exists in ReAuthAccount table, if exists then update info, if not exist then insert
    const result = await transaction
      .request()
      .input("id", sql.VarChar, newId)
      .input("accountId", sql.VarChar, accountId)
      .query(`INSERT INTO ReAuthAccount VALUES (@id, @accountId)`);

    return result;
  },

  removeReAuthAccount: async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
    // Delete accountId from ReAuthAccount table database
    const result = await transaction
      .request()
      .input("accountId", sql.VarChar, accountId)
      .query(`DELETE FROM ReAuthAccount WHERE accountId = @accountId`);

    return result;
  },
};

export default ReAuthAccountServices;