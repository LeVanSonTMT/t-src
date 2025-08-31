class HttpError extends Error {
  public statusCode: number;
  public errorMessage: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.errorMessage = message;
    this.statusCode = statusCode;

    // Thiết lập tên lỗi chính xác (hữu ích khi logging)
    this.name = this.constructor.name;

    // Đảm bảo ngăn xếp lỗi chính xác khi sử dụng class kế thừa
    Error.captureStackTrace(this, this.constructor);
  }
};

export default HttpError;