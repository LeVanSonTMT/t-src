const strings = {
  common: {
    NO_DATA: "Không có dữ liệu",
    SERVER_ERROR: "SERVER_ERROR",
    ID_NOT_FOUND: "Id không tồn tại",
    CODE_NOT_FOUND: "Mã không tồn tại",
    FILE_NOT_FOUND: "File không tồn tại",
    DATA_NOT_FOUND: "Không tìm thấy dữ liệu",
    CONVERT_FILE_NOT_SUCCESS: "Chuyển đổi file không thành công",
  },

  auth: {
    ACCOUNT_LOCKED: "Tài khoản đã bị khóa",
    ACCESS_DENIED: "Không có quyền truy cập",
    INVALID_PASSWORD: "Mật khẩu không chính xác",
    CHANGED_PASSWORD: "Mật khẩu không chính xác",
    VERIFY_REFRESH_TOKEN: "Lỗi xác minh Refresh-Token",
    REFRESH_TOKEN_IS_NOT_NULL: "-TRefreshoken bị rỗng",
    ACCOUNT_NOT_FOUND: "Không tìm thấy tài khoản đăng nhập",
    TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn!\n Vui lòng đăng nhập lại",
    OLD_PASSWORD_INCORRECT: "Mật khẩu hiện tại không đúng. Vui lòng nhập lại",
    CONFIRM_PASSWORD_INCORRECT: "Xác nhận mật khẩu chưa đúng. Vui lòng nhập lại",
  },

  error_multer: {
    ERROR_LOADING_FILE: "Error loading file: ",
    INVALID_FILE: "File không hợp lệ. Chỉ chấp nhận các file",
    LIMIT_PART_COUNT: "Vượt quá số lượng phần (parts) được cho phép.",
    LIMIT_FIELD_COUNT: "Số lượng trường form vượt quá giới hạn.",
    LIMIT_FIELD_VALUE: "Độ dài giá trị trường form vượt quá giới hạn.",
    LIMIT_FIELD_KEY: "Độ dài khóa trường form vượt quá giới hạn.",
    LIMIT_FILE_COUNT: "Số lượng tập tin vượt quá giới hạn.(Tối đa 5 tập tin)",
    LIMIT_FILE_SIZE: "Kích thước tập tin vượt quá giới hạn.(Tối đa 1GB)",
    LIMIT_UNEXPECTED_FILE: "Tên tập tin không mong đợi hoặc vượt quá số lượng tập tin cho phép ở tập tin đó.",
  },

  error_validate: {
    ROLE_CODE_ALREADY_EXISTS: "Mã quyền đã tồn tại. Vui lòng nhập lại mã quyền khác",
    MODULE_CODE_ALREADY_EXISTS: "Mã mô-đun đã tồn tại. Vui lòng nhập lại mã mô-đun khác",
    CODE_NAME_ALREADY_EXISTS: "Mã danh mục đã tồn tại. Vui lòng nhập lại mã danh mục khác",
    SETTING_CODE_ALREADY_EXISTS: "Mã thiết lập đã tồn tại. Vui lòng nhập lại mã thiết lập khác",
    RESOURCE_CODE_ALREADY_EXISTS: "Mã tính năng đã tồn tại. Vui lòng nhập lại mã tính năng khác",
    ACCOUNT_CODE_ALREADY_EXISTS: "Mã thành viên đã tồn tại. Vui lòng nhập lại mã thành viên khác",
  },


};

export default strings;
