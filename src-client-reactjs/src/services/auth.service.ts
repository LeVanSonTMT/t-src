import Constants from "constants/constants";
import { HttpClient } from "../commons/httpClient";



const AuthService = {
    async login(data: {
        password: string;
        accountCode: string;
    }): Promise<any> {
        const result = await HttpClient().post(Constants.ApiPath.AUTH.LOGIN, data);
        return result.data.result;
    },

    async refreshToken(refreshToken: string): Promise<any> {
        const result = await HttpClient().post(Constants.ApiPath.AUTH.REFRESH_TOKEN, { refreshToken });
        return result.data.result;
    },

    async changePassword(data: {
        accountId: string,
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    }): Promise<any> {
        const result = await HttpClient().post(Constants.ApiPath.AUTH.CHANGE_PASSWOD, data);
        return result.data.result;
    },

};

export default AuthService;
