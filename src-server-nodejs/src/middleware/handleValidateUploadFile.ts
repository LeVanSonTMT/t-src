import path from "path";
import multer from "multer";

import helpers from "../common/helpers";
import strings from "../constant/strings";
import constants from "../constant/constants";
import { errorResponse } from "../common/responseFormatter";



const HandleValidateUploadFile = {

  multerError: () => {
    return (err: any, req: any, res: any, next: any) => {
      if (err instanceof multer.MulterError) {
        // Error multer
        let message;
        switch (err.code) {
          case "LIMIT_PART_COUNT":
            message = strings.error_multer.LIMIT_PART_COUNT;
            break;
          case "LIMIT_FIELD_COUNT":
            message = strings.error_multer.LIMIT_FIELD_COUNT;
            break;
          case "LIMIT_FILE_COUNT":
            message = strings.error_multer.LIMIT_FILE_COUNT;
            break;
          case "LIMIT_FIELD_KEY":
            message = strings.error_multer.LIMIT_FIELD_KEY;
            break;
          case "LIMIT_FILE_SIZE":
            message = strings.error_multer.LIMIT_FILE_SIZE;
            break;
          case "LIMIT_FIELD_VALUE":
            message = strings.error_multer.LIMIT_FIELD_VALUE;
            break;
          case "LIMIT_UNEXPECTED_FILE":
            message = strings.error_multer.LIMIT_UNEXPECTED_FILE;
            break;
          default:
            message = strings.error_multer.ERROR_LOADING_FILE + err.code;
        };

        return errorResponse({
          res,
          error: message,
          statusCode: constants.statusCode.BAD_REQUEST,
        });
      } else if (err) {
        return errorResponse({
          res,
          error: err.message,
          statusCode: constants.statusCode.INTERNAL_SERVER_ERROR,
        });
      };
      next();
    };
  },

  validateFile: ({ maxFile = 5 }: { maxFile?: number }) => {
    // Setting saveas file
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        const safeName = helpers.decodeFilename(file.originalname);
        const uniqueName = Date.now() + + Math.floor(1000 + Math.random() * 9000);
        cb(null, uniqueName + "_" + safeName);
      }
    });

    const dataLimits = {
      parts: 1000,                    // Tổng số phần (fields + files)
      files: maxFile,                 // Số lượng file tối đa được upload
      fields: 500,                    // Số lượng field (non-file) tối đa
      fileSize: 1024 * 1024 * 1024,   // Kích thước file tối đa (bytes)
      fieldSize: 1024 * 1024,         // Kích thước tối đa của giá trị field (bytes)
      headerPairs: 2000,              // Số lượng cặp key-value tối đa trong header
      fieldNameSize: 1000,            // Kích thước tối đa của tên field (bytes)
    };

    const upload = multer({
      storage: storage,
      limits: dataLimits,
      fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain"
        ];

        const mimetype = allowedMimeTypes.includes(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error(`${strings.error_multer.INVALID_FILE} ${filetypes}!`));
        };
      }
    });

    return upload.any();
  },

};

export default HandleValidateUploadFile;