import { getConnection } from "../config/dbConfig";
import reAuthAccountRedis from "../config/reAuthAccountRedis";
import reAuthAccountServices from "../services/reAuthAccountServices";



const generateReAuthKey = (accountId: string) => {
  return `reAuthAcc:${accountId}`;
};

const ReAuthAccountActions = {
  // Load data into cache
  async loadReAuthAccountIntoCache() {
    try {
      const pool = await getConnection();

      const result = await reAuthAccountServices.getReAuthAccount({ transaction: pool });

      for (let row of result.recordset) {
        await reAuthAccountRedis.set(generateReAuthKey(row.accountId), "true");
      };

      console.log("ReAuth Account saved to Redis successfully.");
    } catch (error) {
      console.error("Error loading cache:", error);
    }
  },

  // Check if accountId is in cache
  async isAccountInCacheRedis(accountId: string) {
    try {
      const result = await reAuthAccountRedis.get(generateReAuthKey(accountId));
      return result !== null;
    } catch (error) {
      console.error("Error checking cache:", error);
      return false;
    }
  },

  addReAuthAccount: async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
    try {
      // Check if accountId exists in ReAuthAccount table, if exists then update info, if not exist then insert
      await reAuthAccountServices.addReAuthAccount({ transaction, accountId });

      // Delete accountId from cache and add back to cache
      await reAuthAccountRedis.del(generateReAuthKey(accountId));
      await reAuthAccountRedis.set(generateReAuthKey(accountId), "true");

    } catch (error) {
      console.error("Error add from cache:", error);
    }
  },

  removeReAuthAccount: async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
    try {
      // Delete accountId from ReAuthAccount table database
      await reAuthAccountServices.removeReAuthAccount({ transaction, accountId });

      // Clear accountId from cache
      await reAuthAccountRedis.del(generateReAuthKey(accountId));

    } catch (error) {
      console.error("Error removing from cache:", error);
    }
  },

};

export default ReAuthAccountActions;