import { isMobile } from "react-device-detect";
import { useEffect, useRef, useState } from "react";
import { AttachFile, Delete, Download } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";


export interface IDataFile {
    file?: any;
    id?: string;
    name?: string;
    type?: string;
    error?: string;
};

const BoxUploadFile = (props: {
    disabled?: boolean;
    dataFile?: IDataFile;
    onChangeData?: (dataFile?: IDataFile) => void;
}) => {

    const singleChangeFileUploadRef = useRef<any>(null);
    const [dataFile, setDataFile] = useState<IDataFile>({});

    useEffect(() => {
        if (props.dataFile) {
            setDataFile(props.dataFile);
        } else {
            setDataFile({});
            if (singleChangeFileUploadRef.current) {
                singleChangeFileUploadRef.current.value = null;
            };
        }
    }, [props.dataFile]);

    const handleSingleChangeFileUpload = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setDataFile({
                error: undefined,
                file: event?.target?.files?.[0],
                name: event?.target?.files[0]?.name,
                type: event?.target?.files[0]?.type,
            });
            props.onChangeData && props.onChangeData({
                error: undefined,
                file: event?.target?.files?.[0],
                name: event?.target?.files[0]?.name,
                type: event?.target?.files[0]?.type,
            });
        };
    };

    return (
        <Box style={{ width: "100%" }}>
            <Box sx={{
                padding: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#42424a",
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
            }}>
                <Typography variant="h6" color="white">
                    {Strings.COMMON.UPLOAD_FILE_CUMPUTER}
                </Typography>
            </Box>
            {Helpers.isNullOrEmpty(dataFile?.file) &&
                <Box
                    sx={{
                        width: "100%",
                        marginY: "20px",
                        paddingY: "20px",
                        fontSize: "1rem",

                        outline: "none",
                        backgroundColor: "#fcfcfc",
                        border: "2px dashed #e4e4e4",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(!props.disabled && {
                            "&:hover": {
                                border: "2px dashed #42424a",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }
                        }),
                    }}
                    onClick={() => {
                        if (!props.disabled && singleChangeFileUploadRef.current) {
                            singleChangeFileUploadRef.current.value = null;
                            singleChangeFileUploadRef.current.click();
                        };
                    }}
                >
                    <AttachFile color={props.disabled ? "disabled" : "inherit"} />
                    <Typography
                        variant="button"
                        sx={{ fontSize: "1rem" }}
                        color={props.disabled ? "textDisabled" : "textPrimary"}
                    >
                        {Strings.COMMON.CLICK_SELECT_FILE}
                    </Typography>
                </Box>
            }

            {!Helpers.isNullOrEmpty(dataFile?.file) &&
                <Box
                    sx={{
                        width: "100%",
                        overflow: "auto",
                        boxShadow: 1,
                        paddingTop: "20px",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        paddingBottom: "20px",

                        display: "flex",
                        alignItems: "start",
                        flexDirection: "column",
                        justifyContent: "start",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e4e4e4",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            padding: "8px 16px",
                            position: "relative",

                            borderRadius: "4px",
                            wordBreak: "break-all",
                            backgroundColor: "#e5e7eb",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* File info */}
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Typography
                                variant="button"
                                fontWeight="bold"
                                sx={{
                                    display: "-webkit-box",
                                    fontSize: "1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                &nbsp;{"#"}&nbsp;
                                <Typography variant="button" sx={{ fontSize: "1rem" }}>
                                    {dataFile?.name || "-/-"}
                                </Typography>
                            </Typography>
                        </Box>
                        {!props.disabled &&
                            <Box sx={{
                                gap: 1,
                                display: "flex",
                                alignItems: "center",
                            }}>
                                {!isMobile && dataFile?.id &&
                                    <Tooltip arrow title={Strings.COMMON.DOWNLOAD}>
                                        <IconButton onClick={() => { }}>
                                            <Download />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip arrow title={Strings.COMMON.DELETE}>
                                    <IconButton onClick={() => { setDataFile({}); }}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        }
                    </Box>
                </Box>
            }

            {dataFile?.error &&
                <Typography
                    color="error"
                    variant="caption"
                    sx={{ paddingTop: "8px" }}
                >
                    {dataFile?.error}
                </Typography>
            }

            {/* Single change file upload */}
            <input
                hidden
                type={"file"}
                disabled={props.disabled}
                ref={singleChangeFileUploadRef}
                onChange={handleSingleChangeFileUpload}
            />
        </Box>
    );
};

export default BoxUploadFile;