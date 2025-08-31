import _ from "lodash";
import moment from "moment-timezone";
import { sql } from "../config/dbConfig";
import constants from "../constant/constants";


const Helpers = {
  isNullOrEmpty: (value: any) => {
    return (
      _.isNil(value)
      || (typeof value === "undefined")
      || (typeof value === "number" && _.isEmpty(value))
      || (typeof value === "string" && _.isEmpty(value))
      || (typeof value === "object" && _.isArray(value) && [...value || []].length === 0)
    );
  },

  isArray: (value: any) => {
    return (!Helpers.isNullOrEmpty(value) && _.isArray(value));
  },

  isString: (value: any) => {
    return (!Helpers.isNullOrEmpty(value) && typeof value === "string");
  },

  isNumber: (value: any) => {
    return (!Helpers.isNullOrEmpty(value) && typeof value === "number");
  },

  isStringEmpty: (value: any) => {
    return _.isNil(value) || (typeof value === "string" && _.isEmpty(value));
  },

  isNumberEmpty: (value: any) => {
    return _.isNil(value) || (typeof value === "number" && _.isEmpty(value));
  },

  buildOptionalFieldsQueryParts: (optionalFields: any) => {
    const optionalColumns = optionalFields.map((item: any) => `, ${item}`).join("");
    const optionalValues = optionalFields.map((item: any) => `, @${item}`).join("");
    return {
      optionalColumns,
      optionalValues,
    };
  },

  convertStringToBoolean: (value: string) => {
    if (_.isString(value)) {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }

    return value;
  },

  buildFilterConditions: async ({ filters, request, validColumns }: {
    request: any,
    filters: Object,
    validColumns: { [key: string]: { alias?: string, type: number, columnName?: string } },
  }) => {
    let filterConditions = "";

    if (!_.isEmpty(filters)) {
      for (const [column, value] of Object.entries(filters)) {
        if (validColumns.hasOwnProperty(column) && !Helpers.isStringEmpty(value)) {
          const typeFilter = validColumns[column]?.type;
          const aliasName = validColumns[column]?.alias;
          let columnName = validColumns[column]?.columnName || column;

          let keyword = columnName;
          if (!Helpers.isNullOrEmpty(aliasName)) {
            keyword = `${aliasName}.${columnName}`;
          };

          switch (typeFilter) {
            case constants.filterColumnType.STRING:
              filterConditions += ` AND ${keyword} LIKE '%' + @${columnName} + '%'`;
              const newValue = _.trim(value as string);
              await request.input(columnName, sql.NVarChar, newValue);
              break;

            case constants.filterColumnType.EXACT_STRING:
              filterConditions += ` AND ${keyword} LIKE @${columnName}`;
              const exactString = _.trim(value as string);
              await request.input(columnName, sql.NVarChar, exactString);
              break;

            case constants.filterColumnType.NUMBER:
              filterConditions += ` AND ${keyword} = @${aliasName}_${columnName}`;
              await request.input(`${aliasName}_${columnName}`, sql.Int, Number(value));
              break;

            case constants.filterColumnType.ARRAY:
              if (Array.isArray(value) && value.length > 0) {
                filterConditions += ` AND ${keyword} IN (${value.map((v) => `'${v}'`).join(', ')})`;
              }
              break;

            case constants.filterColumnType.DATE:
              if (value?.startDate && value?.endDate) {
                const endDate = Number(value.endDate);
                const startDate = Number(value.startDate);

                const endParam = `${aliasName}_${columnName}EndDate`;
                const startParam = `${aliasName}_${columnName}StartDate`;

                filterConditions += ` AND ${keyword} BETWEEN @${startParam} AND @${endParam}`;

                await request.input(endParam, sql.Int, endDate);
                await request.input(startParam, sql.Int, startDate);
              }
              break;

            case constants.filterColumnType.BOOLEAN:
              let convertBooleanValue;
              if (typeof value === "boolean") {
                convertBooleanValue = value;
              } else {
                convertBooleanValue = Number(value || 0);
              }
              filterConditions += ` AND ${keyword} = @${columnName}`;
              await request.input(columnName, sql.Bit, convertBooleanValue);
              break;
            default:
              filterConditions += ` AND ${keyword} = @${columnName}`;
              await request.input(columnName, sql.NVarChar, value);
              break;
          }
        }
      }
    }

    return filterConditions;
  },

  formatValueSearchText: (value?: string) => {
    if (Helpers.isNullOrEmpty(value)) {
      return undefined;
    } else {
      const newValue = Helpers.removeAccentsFromStrings(value || "");
      return newValue.replace(/\s+/g, "");;
    };
  },

  removeAccentsFromStrings: (value: string) => {
    // Gộp nhiều dấu space thành 1 space
    let str = value.replace(/\s+/g, " ");
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

    str = str.replace(/[\u0300-\u036f]/g, "") // Xoá các dấu

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

  currentTime: (string?: boolean) => {
    const val = moment().unix();
    return (string === true) ? `${val}` : val;
  },

  generateNumericId: () => {
    const dateNow = Date.now();                                   // 13 digits (e.g., "1715702932468")
    const random = Math.floor(1000 + Math.random() * 9000);       // 4 digits
    return `000${dateNow}${random}`;                              // Total 20 digits
  },

  hasPermission: (permission: number, value: number) => ((permission & value) === value),

  decodeFilename: (name: any) => Buffer.from(name, "latin1").toString("utf8"),

};

export default Helpers;