import { check } from "express-validator";

const CommonRules = {
  pageNumber() {
    return check("pageNumber").optional().custom((value) => {
      const newValue = Number(value);
      if (isNaN(newValue)) {
        throw new Error("PageNumber phải là số nguyên");
      } else {
        return true;
      }
    });
  },

  pageSize() {
    return check("pageSize").optional().custom((value) => {
      const newValue = Number(value);
      if (isNaN(newValue)) {
        throw new Error("PageSize phải là số nguyên");
      } else {
        return true;
      }
    });
  },

  sortOrder() {
    return check("sortOrder").optional().custom((value) => {
      const sort = value.toUpperCase();
      if (typeof value === "string" && (sort === "ASC" || sort === "DESC"))
        return true;
      throw new Error("SortOrder phải là 'ASC' hoặc 'DESC'");
    });
  },

  valueMaxLength(key: string, length: number) {
    return check(key)
      .isLength({ max: length })
      .withMessage(`Giá trị ${key} có chiều dài tối đa là ${length} ký tự`);
  },

  accountLogin() {
    return check("accountCode")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập thông tin tài khoản`)
      .bail({ level: "request" })
      .isLength({ max: 20 })
      .withMessage(`Giá trị accountCode có chiều dài tối đa là 20 ký tự`)
      .bail({ level: "request" })
  },

  passwordLogin() {
    return check("password")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập thông tin mật khẩu`)
      .bail({ level: "request" })
      .isLength({ max: 255 })
      .withMessage(`Giá trị accountCode có chiều dài tối đa là 255 ký tự`)
      .bail({ level: "request" })
  },

  oldPassword() {
    return check("oldPassword")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập mật khẩu hiện tại`)
      .bail({ level: "request" })
      .isLength({ max: 255 })
      .withMessage(`Giá trị oldPassword có chiều dài tối đa là 255 ký tự`)
      .bail({ level: "request" })
  },

  newPassword() {
    return check("newPassword")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập mật khẩu mới`)
      .bail({ level: "request" })
      .isLength({ max: 255 })
      .withMessage(`Giá trị newPassword có chiều dài tối đa là 255 ký tự`)
  },

  confirmPassword() {
    return check("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập mật khẩu xác nhận`)
      .bail({ level: "request" })
      .isLength({ max: 255 })
      .withMessage(`Giá trị confirmPassword có chiều dài tối đa là 255 ký tự`)
      .bail({ level: "request" })
  },

  // CodeNameCommon
  code() {
    return check("code")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập mã`)
      .bail({ level: "request" })
      .isLength({ max: 20 })
      .withMessage(`Giá trị mã có chiều dài tối đa là 20 ký tự`)
      .bail({ level: "request" })
  },

  name() {
    return check("name")
      .trim()
      .notEmpty()
      .withMessage(`Vui lòng nhập tên`)
      .bail({ level: "request" })
      .isLength({ max: 255 })
      .withMessage(`Giá trị tên có chiều dài tối đa là 255 ký tự`)
      .bail({ level: "request" })
  },
};

export default CommonRules;
