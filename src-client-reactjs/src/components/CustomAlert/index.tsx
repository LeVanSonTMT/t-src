import React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useEffect, useMemo } from "react";
import { AlertColor, AlertProps } from "@mui/material/Alert";

import Helpers from "commons/helpers";

let timeOut: any = undefined;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export interface IDataAlert {
    message?: string;
    type: | "warning" | "success" | "error" | "info";
}

interface IProps {
    open: boolean,
    onClose: () => void,
    dataAlert?: IDataAlert,
    autoHideDuration?: number,
}

const CustomAlert: React.FC<IProps> = ({ open, onClose, dataAlert, autoHideDuration }: IProps) => {
    useEffect(() => {
        if (open) {
            timeOut = setTimeout(onClose, autoHideDuration || 3000);
        }
        return () => {
            clearTimeout(timeOut);
        };
    }, [open, autoHideDuration]);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        Helpers.isFunction(onClose) && onClose();
    };

    const severity = useMemo<AlertColor>(() => {
        if (dataAlert?.type === "error") return "error";
        if (dataAlert?.type === "warning") return "warning";
        if (dataAlert?.type === "success") return "success";
        return "info";
    }, [dataAlert?.type]);

    if (Helpers.isNullOrEmpty(dataAlert?.message)) return null;

    return (
        <Snackbar
            open={true}
            onClose={onClose}
            autoHideDuration={autoHideDuration || 3000}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
        >
            <Alert
                variant={"filled"}
                severity={severity}
                onClose={handleClose}
                sx={({ palette }) => ({
                    fontSize: "0.975rem",
                    boxShadow: "none",
                    fontWeight: "bold",
                })}
            >
                {dataAlert?.message || ""}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;