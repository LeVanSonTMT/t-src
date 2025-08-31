const constants = {

  pageSize: 10,
  pageNumber: 1,

  statusCode: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    TOKEN_EXPIRED: 401,
    NOT_PERMISSION: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  booleanInt: {
    TRUE: 1,
    FALSE: 0,
  },

  status: {
    DELETED: -9,
    LOCKED: -2,
    CANCELED: -3,
    REJECTED: -4,
    DRAFTED: -1,
    INACTIVED: 0,
    ACTIVED: 1,
  },

  action: {
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3,
  },

  role: {
    ADMIN: "000001",
    NORMAL: "000008",
    SUPPER_ADMIN: "000000",
  },

  codeNameCommon: {

  },

  filterColumnType: {
    STRING: 1,
    BOOLEAN: 2,
    DATE: 3,
    NUMBER: 4,
    ARRAY: 5,
    EXACT_STRING: 6,
  },

  compareCondition: {
    GREATER_THAN: ">",
    LESS_THAN: "<",
    GREATER_THAN_EQUAL: ">=",
    LESS_THAN_EQUAL: "<=",
    EQUAL: "==",
    NOT_EQUAL: "!=",
  },

  method: {
    GET: "GET",
    PUT: "PUT",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE",
  },

  permission: {
    READ: 1,
    PRINT: 2,
    EXPORT: 4,
    DOWNLOAD: 16,
    CREATE: 32,
    IMPORT: 64,
    UPDATE: 128,
    DELETE: 256,
  },

  factoryCode: {
    AN_PHU: "AnPhu",
    AN_PHONG: "AnPhong",
    TAN_LONG: "TanLong",
  },

  statusCT: {
    new: 0,
    complete: 1,
  },

};

export default constants;