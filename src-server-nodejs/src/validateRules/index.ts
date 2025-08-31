import CommonRules from "./commonRules";



const validatePagination = [
  CommonRules.pageSize(),
  CommonRules.sortOrder(),
  CommonRules.pageNumber(),
];

const validateLogin = [
  CommonRules.accountLogin(),
  CommonRules.passwordLogin(),
];

const validateChangePW = [
  CommonRules.newPassword(),
  CommonRules.oldPassword(),
  CommonRules.confirmPassword(),
];

const validateCodeNameCommon = [
  CommonRules.code(),
  CommonRules.name(),
  CommonRules.valueMaxLength("description", 1000),
];


export {
  validateLogin,
  validateChangePW,
  validatePagination,
  validateCodeNameCommon,
};
