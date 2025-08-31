/* eslint-disable no-throw-literal */
import axios from "axios";
import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Constants from "constants/constants";


export enum ContentType {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
};

export enum Method {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
};

// const eventEmitter = new EventEmitter();

export const HttpClient = () => {

    let config: any = {
        baseURL: "http://localhost:5001/api",
        timeout: Constants.Api.TIMEOUT,
    };

    const instance = axios.create(config);

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (!Helpers.isNullOrEmpty(error?.response)) {
                const x_message = error?.response?.headers?.["x-message"];
                if (!Helpers.isNullOrEmpty(x_message)) {
                    throw {
                        code: error?.response?.status,
                        message: Helpers.decodeValue(x_message),
                    };
                };

                const arrValidationErrors = [...error?.response?.data?.responseException?.validationErrors || []].map(el => (el.message as string));
                const stringValidationErrors = arrValidationErrors.length === 0 ? undefined : arrValidationErrors.join("; ");

                if (error?.response?.status === Constants.ApiCode.TOKEN_EXPIRED) {
                    __EventEmitter.emit(Constants.EventName.TOKEN_EXPIRED);
                    throw undefined;
                } else if (error?.response?.status === Constants.ApiCode.NOT_PERMISSION) {
                    throw {
                        code: error?.response?.status,
                        message: Strings.MESSAGE.NOT_PERMISSION
                    };
                } else {
                    throw {
                        code: error?.response?.status,
                        message:
                            stringValidationErrors ||
                            error?.response?.data?.responseException?.exceptionMessage ||
                            error?.response?.data?.responseException?.ExceptionMessage ||
                            error?.response?.data?.ResponseException?.exceptionMessage ||
                            error?.response?.data?.ResponseException?.ExceptionMessage ||
                            error?.response?.data?.message?.Message ||
                            error?.response?.data?.message?.message ||
                            error?.response?.data?.Message?.Message ||
                            error?.response?.data?.Message?.message ||
                            error?.response?.data?.Message ||
                            error?.response?.data?.message ||
                            error?.response?.data?.error?.Message ||
                            error?.response?.data?.error?.message ||
                            error?.response?.data?.error ||
                            ""
                    };
                };
            } else {
                throw {
                    code: error?.code,
                    message: error?.message || error,
                };
            };
        }
    );

    return instance;
};