import { useEffect, useRef, useState } from "react";
import { Close, RemoveRedEye } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography, } from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import CustomTextField from "components/CustomTextField";


export interface IDataFile {
    file?: any;
    id?: string;
    name?: string;
    type?: string;
    error?: string;
};

const InputUploadFile = (props: {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    dataFile?: IDataFile;
    placeholder?: string;
    errorMessage?: string;
    allowedTypes?: string[];
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
        if (event.target.files && event.target.files?.[0]) {
            if (
                ([...props.allowedTypes || []].length === 0) ||
                [...props.allowedTypes || []].includes(event.target.files?.[0]?.type)
            ) {
                setDataFile({
                    error: undefined,
                    file: event?.target?.files?.[0],
                    name: event?.target?.files?.[0]?.name,
                    type: event?.target?.files?.[0]?.type,
                });
                props.onChangeData && props.onChangeData({
                    error: undefined,
                    file: event?.target?.files?.[0],
                    name: event?.target?.files?.[0]?.name,
                    type: event?.target?.files?.[0]?.type,
                });
            } else {
                props.onChangeData && props.onChangeData({
                    error: "Loại tệp tin không hợp lệ",
                    file: undefined,
                    name: undefined,
                    type: undefined,
                });
            }
        };
    };

    return (
        <Box style={{ width: "100%" }}>
            <Box
                component={"div"}
                onClick={() => {
                    if (!props.disabled && singleChangeFileUploadRef.current) {
                        singleChangeFileUploadRef.current.value = null;
                        singleChangeFileUploadRef.current.click();
                    };
                }}
            >
                <CustomTextField
                    label={props.label}
                    variant={"outlined"}
                    value={dataFile?.name || ""}
                    required={props.required}
                    disabled={props.disabled}
                    placeholder={props?.placeholder}
                    errorMessage={props?.errorMessage}
                    iconEnd={
                        !Helpers.isNullOrEmpty(dataFile?.file) &&
                        <Box sx={{
                            gap: 1,
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <Tooltip arrow title={"Xem"}>
                                <IconButton
                                    color="info"
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (!Helpers.isNullOrEmpty(dataFile?.file)) {
                                            // Tạo URL tạm để xem file
                                            const fileURL = URL.createObjectURL(dataFile?.file);
                                            // Mở file trong tab mới
                                            window.open(fileURL, "_blank");
                                        }
                                    }}
                                >
                                    <RemoveRedEye />
                                </IconButton>
                            </Tooltip>
                            {
                                !props.disabled &&
                                <Tooltip arrow title={Strings.COMMON.DELETE}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDataFile({});
                                            props.onChangeData && props.onChangeData(undefined);
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Box>
                    }
                />
                {Helpers.isNullOrEmpty(props?.errorMessage) && ([...props.allowedTypes || []].length > 0) &&
                    <Typography variant="caption" color="textSecondary">
                        {`(Chỉ cho phép loại tập tin: ${[...props.allowedTypes || []].join(", ")})`}
                    </Typography>
                }
            </Box>

            {/* Single change file upload */}
            <input
                hidden
                type={"file"}
                disabled={props.disabled}
                ref={singleChangeFileUploadRef}
                onChange={handleSingleChangeFileUpload}
                accept={([...props.allowedTypes || []].length > 0) ? [...props.allowedTypes || []].join(", ") : undefined}
            />
        </Box>
    );
};

export default InputUploadFile;