import { Express } from "express";

import AuthRoutes from "../routes/authRoutes";
import CodeNameCommonRoutes from "../routes/codeNameCommonRoutes";

export const setupPaths = (app: Express) => {
  app.use("/api", AuthRoutes);
  app.use("/api/codeNameCommon", CodeNameCommonRoutes);
};
