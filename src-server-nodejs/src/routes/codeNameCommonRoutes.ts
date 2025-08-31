import express from "express";

import constants from "../constant/constants";
import authenticateToken from "../middleware/authenticateToken";
import handleValidationErrors from "../middleware/handleValidationErrors";
import codeNameCommonController from "../controllers/codeNameCommonControllers";

import { validateCodeNameCommon, validatePagination } from "../validateRules";


const router = express.Router();

const roles: string[] = [];

router.get(
    "/getAll",
    authenticateToken([]),
    codeNameCommonController.getAll,
);

router.get(
    "/getByParentCode",
    authenticateToken([]),
    codeNameCommonController.getByParentCode,
);

router.get(
    "/getPage",
    authenticateToken([]),
    validatePagination,
    handleValidationErrors,
    codeNameCommonController.getPage,
);

router.get(
    "/getPageLogs",
    authenticateToken([]),
    validatePagination,
    handleValidationErrors,
    codeNameCommonController.getPageLogs,
);

router.get(
    "/detail/:id",
    authenticateToken([]),
    handleValidationErrors,
    codeNameCommonController.getDetail,
);

router.post(
    "/create",
    authenticateToken(roles),
    validateCodeNameCommon,
    handleValidationErrors,
    codeNameCommonController.create,
);

router.post(
    "/update",
    authenticateToken(roles),
    validateCodeNameCommon,
    handleValidationErrors,
    codeNameCommonController.update,
);

router.delete(
    "/delete/:id",
    authenticateToken(roles),
    codeNameCommonController.delete,
);

export default router;