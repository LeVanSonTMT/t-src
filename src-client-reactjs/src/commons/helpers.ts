import moment from "moment";
import Swal from "sweetalert2";
import { isArray } from "lodash";
import { hexToRgb } from "@mui/material";

import Strings from "constants/strings";
import Constants from "constants/constants";
import { IMultiLanguageContent } from "./interfaces";

/**
 * Helpers.ts
 *
 * Common function for app.
 */
const Helpers = {
    isNumber: (value: any): value is number => {
        return typeof value === "number";
    },

    isString: (value: any): value is string => {
        return typeof value === "string";
    },

    isObject: (value: any): value is object => {
        return typeof value === "object";
    },

    isFunction: (value: any): value is (...args: any) => void => {
        return typeof value === "function";
    },

    isNaN: (value: any): value is number => {
        return isNaN(value);
    },

    isNullOrEmpty: (value: any): value is undefined | boolean => {
        if (isArray(value) && value.length === 0) {
            return true;
        } else return value === undefined || value === null || value === "";
    },

    isValidPhoneNumber: (phoneNumber: string) => {
        return Constants.RegExp.PHONE_NUMBER.test(phoneNumber);
    },

    isValidEmail: (email: string) => {
        return Constants.RegExp.EMAIL_ADDRESS.test(email);
    },

    isValidIdCard: (idCard: string) => {
        return Constants.RegExp.ID_CARD.test(idCard);
    },

    isValidDate: (value: string) => {
        return Constants.RegExp.DATE.test(value);
    },

    // isCocCoc: () => {
    //     const thisWindow: any = window;
    //     const brands: any[] = thisWindow?.navigator?.userAgentData?.brands || [];
    //     const indexOfCocCoc = brands?.findIndex((item) => item.brand === Constants.COCCOC_BRAND_NAME);
    //     return indexOfCocCoc !== -1;
    // },

    stringToSizeByte: (text: string) => {
        return new TextEncoder().encode(text).length;
    },

    rgba(color: string, opacity: number): string {
        return `rgba(${hexToRgb(color)}, ${opacity})`;
    },

    pxToRem(number: number, baseNumber: number = 16): string {
        return `${number / baseNumber}rem`;
    },

    boxShadow(
        offset: number[],
        radius: number[],
        color: string,
        opacity: number,
        inset: string = ""
    ): string {
        const [x, y] = offset;
        const [blur, spread] = radius;

        return `${inset} ${Helpers.pxToRem(x)} ${Helpers.pxToRem(y)} ${Helpers.pxToRem(blur)} ${Helpers.pxToRem(spread)} ${Helpers.rgba(
            color,
            opacity
        )}`;
    },

    uniqueArray: (arr: (string | number)[]) => {
        return arr.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
    },

    datetimeToString: (date: number | Date | undefined, format?: string): string => {
        if (Helpers.isNullOrEmpty(date)) {
            return "";
        } else if (Helpers.isNumber(date) && `${date}`.length === 10) {
            return moment.unix(date).format(format || Constants.DateFormat.DDMMYYYY);
        } else {
            return moment(date).format(format || Constants.DateFormat.DDMMYYYY);
        }
    },

    toUnixTime: (value?: any) => {
        if (Helpers.isNullOrEmpty(value) || value === 0 || value === "0") {
            return undefined;
        } else if (`${value}`.length === 10) {
            return Number(value) * 1000;
        } else {
            return moment(value).unix();
        }
    },

    copyProperties: (sourceObj: any, distObj: any) => {
        for (const key in sourceObj) {
            if (!sourceObj.hasOwnProperty(key)) {
                continue;
            }
            const sourceObjData: any = sourceObj[key];
            if (!Helpers.isNullOrEmpty(sourceObjData)) {
                if (Array.isArray(sourceObjData)) {
                    const distObjData: any = [];
                    Helpers.copyProperties(sourceObjData, distObjData);
                    distObj[key] = distObjData;
                    continue;
                }
                if (Helpers.isObject(sourceObjData)) {
                    const distObjData: any = {};
                    Helpers.copyProperties(sourceObjData, distObjData);
                    distObj[key] = distObjData;
                    continue;
                }
            }
            distObj[key] = sourceObjData;
        }
    },

    cloneObject: <T>(sourceObj: T): T => {
        const cloneObj: T = {} as T;
        Helpers.copyProperties(sourceObj, cloneObj);
        return cloneObj;
    },

    showAlert: async (p: {
        message: string,
        type?: "warning" | "success" | "error" | "info" | "question",
        okCallback?: () => void,
    }) => {
        const okPress = await Swal.fire({
            customClass: {
                container: "custom-sweetalert2",
                confirmButton: "custom-sweetalert2-btn-ok",
            },
            text: p.message,
            icon: p.type || "warning",
            allowOutsideClick: false,
        });
        if (okPress && okPress.isConfirmed && p.okCallback && Helpers.isFunction(p.okCallback)) {
            p.okCallback();
        } else { };
    },

    showConfirmAlert: async (p: {
        message: string,
        btnOk?: string,
        btnCancel?: string,
        onOk: () => void,
        onCancel?: () => void,
    }) => {
        const okPress = await Swal.fire({
            customClass: {
                container: "custom-sweetalert2",
                confirmButton: "custom-sweetalert2-btn-ok",
                cancelButton: "custom-sweetalert2-btn-cancel",
            },
            icon: "warning",
            text: p.message,
            reverseButtons: true,
            showCancelButton: true,
            confirmButtonText: p.btnOk || Strings.COMMON.OK,
            cancelButtonText: p.btnCancel || Strings.COMMON.CANCEL,
        });
        if (okPress && okPress.isConfirmed && p.onOk && Helpers.isFunction(p.onOk)) {
            p.onOk();
        } else {
            if (p.onCancel && Helpers.isFunction(p.onCancel)) {
                p.onCancel();
            } else { }
        }
    },

    handleFormatParams(data: any) {
        let params = new URLSearchParams();
        Object.entries(data).forEach(([key, values]) => {
            if (!Helpers.isNullOrEmpty(values)) {
                if (Array.isArray(values) && values.length > 0) {
                    values.forEach((value, index) => {
                        if (!Helpers.isNullOrEmpty(value) && typeof value !== "object") {
                            params.append(key, value.toString());
                        }
                        if (!Helpers.isNullOrEmpty(value) && typeof value === "object") {
                            Object.entries(value).forEach(([objkey, objValue]) => {
                                if (!Helpers.isNullOrEmpty(objValue)) params.append(`${key}[${index}].${objkey}`, (objValue || "").toString());
                            });
                        }
                    });
                } else {
                    params.append(key, `${values}`);
                };
            };
        });
        return params.toString();
    },

    handleFormatJSON: (data: any) => {
        const result: any = {};
        Object.entries(data).forEach(([key, values]) => {
            if (!Helpers.isNullOrEmpty(values)) {
                result[key] = values;
            };
        });
        return result;
    },

    formatCurrency: (number: number | string, decimals?: number) => {
        var a = Number(number)
            .toFixed(decimals || 0)
            .split(".");
        a[0] = a[0].replace(/\d(?=(\d{3})+$)/g, "$&,");
        if (Number(number) < 0) {
            return `${a.join(".")}`;
        } else {
            return a.join(".");
        };
    },

    setItemInSessionStorage: (storageKey: string, value: any) => {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
    },

    getItemInSessionStorage: (storageKey: string, defaultValue?: any): any => {
        const value = sessionStorage.getItem(storageKey);
        if (!Helpers.isNullOrEmpty(value) && value !== "undefined" && value !== "null") {
            return JSON.parse(value);
        } else {
            return defaultValue;
        };
    },

    setItemInLocalStorage: (storageKey: string, value: any) => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    },

    getItemInLocalStorage: (storageKey: string, defaultValue?: any): any => {
        const value = localStorage.getItem(storageKey);
        if (!Helpers.isNullOrEmpty(value) && value !== "undefined" && value !== "null") {
            return JSON.parse(value);
        } else {
            return defaultValue;
        };
    },

    converStringToJson: (value?: any): any => {
        if (Helpers.isNullOrEmpty(value) || value === "undefined" || value === "null") {
            return undefined;
        } else {
            try {
                const newValue = JSON.parse(value);
                return newValue;
            } catch (error) {
                return undefined;
            }
        };
    },

    getUrlParams: (keys: string[]): { [key: string]: string | undefined } => {
        const params = new URLSearchParams(window.location.search);
        let datas: { [key: string]: string | undefined } = {};
        keys.forEach((key) => {
            datas[key] = params.get(key) || undefined;
        });
        return datas;
    },

    getPageNumber: (pageNumber?: number, pageSize?: number, totalCount?: number) => {
        const size = pageSize || 1;
        const page = pageNumber || 1;
        const total = totalCount || 0;
        const newPage = (Math.ceil(total / size) || 1);
        return (page > newPage) ? newPage : page;
    },

    getDefaultValueMultiLanguage: (data: IMultiLanguageContent | undefined, currentLanguage?: string, allowOtherLanguage?: boolean): string => {
        if (Helpers.isNullOrEmpty(data)) {
            return "";
        } else {
            if (Helpers.isNullOrEmpty(currentLanguage)) {
                if (Helpers.isNullOrEmpty(data?.value?.[Constants.DefaultLanguage])) {
                    if (allowOtherLanguage) {
                        const value: any = [...Object.values(data?.value) || []].find(v => !Helpers.isNullOrEmpty(v));
                        return value || "";
                    } else {
                        return "";
                    }
                } else {
                    return data?.value?.[Constants.DefaultLanguage] || "";
                }
            } else {
                if (Helpers.isNullOrEmpty(data?.value?.[currentLanguage])) {
                    if (Helpers.isNullOrEmpty(data?.value?.[Constants.DefaultLanguage])) {
                        if (allowOtherLanguage) {
                            const value: any = [...Object.values(data?.value) || []].find(v => !Helpers.isNullOrEmpty(v));
                            return value || "";
                        } else {
                            return "";
                        }
                    } else {
                        return data?.value?.[Constants.DefaultLanguage] || "";
                    }
                } else {
                    return data?.value?.[currentLanguage] || "";
                }
            }
        };
    },

    removeAccentsFromStrings: (value: string) => {
        let str = value;
        // Gộp nhiều dấu space thành 1 space
        str = str.replace(/\s+/g, " ");
        // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của chuỗi
        str = str.trim();

        // bắt đầu xóa dấu tiếng việt trong chuỗi
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");

        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");

        return str;
    },

    decodeValue: (valueEncoded: any) => {
        const decoded = decodeURIComponent(valueEncoded);
        const value = decoded.normalize("NFC");
        return value;
    },

    getCharacterAvatar: (name?: string): string => {
        if (Helpers.isNullOrEmpty(name)) {
            return "";
        };

        const itemNames = name.split(" ").filter((value: string) => {
            return value.trim().length > 0;
        });

        let fName = "";

        if (itemNames.length >= 2) {
            for (let i = itemNames.length - 2; i < itemNames.length; i++) {
                if (itemNames[i].length > 0) {
                    fName = fName + itemNames[i].substring(0, 1).toUpperCase();
                }
            }
        } else {
            fName = itemNames[0].substring(0, 2).toUpperCase();
        }

        return fName;
    },

    getBrowserInfo: () => {
        const userAgent = navigator.userAgent;

        if (/chrome|crios|crmo/i.test(userAgent) && !/edge|opr|brave/i.test(userAgent)) {
            return Constants.BrowserName.CHROME;
        } else if (/firefox|fxios/i.test(userAgent)) {
            return Constants.BrowserName.FIREFOX;
        } else if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) {
            return Constants.BrowserName.SAFARI;
        } else if (/edg/i.test(userAgent)) {
            return Constants.BrowserName.EDGE;
        } else if (/opr\//i.test(userAgent)) {
            return Constants.BrowserName.OPERA;
        } else if (/coc_coc_browser|CocCoc|coccoc\//i.test(userAgent)) {
            return Constants.BrowserName.COC_COC;
        } else {
            return "Other";
        }
    },


};

export default Helpers;
