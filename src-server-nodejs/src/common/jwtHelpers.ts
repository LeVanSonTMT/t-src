import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IRequestAccountByJWT } from "../model/auth";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const JWTHelpers = {
  generateAccessToken: (account: IRequestAccountByJWT) => {
    const accessToken = jwt.sign(
      {
        fullName: account?.fullName,
        roleCode: account?.roleCode,
        accountId: account?.accountId,
        accountCode: account?.accountCode,
      },
      SECRET_KEY,
      {
        expiresIn: "1d", // Access token expires in 1 day
      }
    );

    return accessToken;
  },

  generateRefreshToken: (account: IRequestAccountByJWT) => {
    const refreshToken = jwt.sign(
      {
        fullName: account?.fullName,
        roleCode: account?.roleCode,
        accountId: account?.accountId,
        accountCode: account?.accountCode,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d", // Refresh token expires in 1 days
      }
    );

    return refreshToken;
  },
};

export default JWTHelpers;
