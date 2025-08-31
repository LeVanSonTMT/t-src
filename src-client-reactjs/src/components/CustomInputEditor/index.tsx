import { useMemo, useRef } from "react";
import { Suspense, lazy, memo } from "react";

import { Mode } from "commons/enum";
import Helpers from "../../commons/helpers";

import "./styles.css";
import { Box, Typography } from "@mui/material";

const JoditEditor = lazy(() => import("jodit-react"));

export interface Props {
    mode?: number;
    value?: string;
    label?: string;
    disable?: boolean;
    readonly?: boolean;
    required?: boolean;
    placeholder?: string;
    errorMessage?: string;
    hideToolbar?: boolean;
    maxHeight?: number | string;
    editHTMLDocumentMode?: boolean;
    enter?: "br" | "p",
    onBlur?: (value: string) => void;
    onChangeValue?: (value: string) => void;
};

// all options from https://xdsoft.net/jodit/docs/
const CustomInputEditor: React.FC<Props> = (props: Props) => {
    const editor = useRef(null);
    const config: any = {
        // value: props.value,
        uploader: {
            // ảnh được mã hóa trực tiếp vào nội dung (không cần server)
            insertImageAsBase64URI: true
        },
        enter: props.enter ?? "p",
        iframe: true, // enable iframe mode,
        height: props.maxHeight || "auto",
        toolbar: (props.mode === Mode.View || props.hideToolbar) ? false : true,
        readonly: props.mode === Mode.View || props.readonly,
        statusbar: (props.mode === Mode.View || props.hideToolbar) ? false : true,
        placeholder: props.placeholder || "",
        editHTMLDocumentMode: props.editHTMLDocumentMode,
    };

    const typographyProps: any = useMemo(() => {
        return {
            variant: "caption",
            fontSize: "0.795rem",
            fontWeight: "regular",
            color: Helpers.isNullOrEmpty(props.errorMessage) ? "textSecondary" : "error",
        };
    }, [props.errorMessage]);

    return (
        <Box>
            <Box>
                <Typography {...typographyProps}>
                    {`${props.label} ${props.required ? "*" : ""}`}
                </Typography>
            </Box>

            <Suspense fallback="Loading rich text input...">
                <JoditEditor
                    ref={editor}
                    config={config}
                    value={props.value}
                    onChange={(newContent) => {
                        Helpers.isFunction(props.onChangeValue) && props.onChangeValue(newContent);
                    }}
                    onBlur={(newContent) => {
                        Helpers.isFunction(props.onBlur) && props.onBlur(newContent);
                    }}
                />
            </Suspense>
            {!Helpers.isNullOrEmpty(props.errorMessage) && (
                <Box>
                    <Typography variant="caption" color="error">
                        {props.errorMessage}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default memo(CustomInputEditor, (prev, next) => {
    if (
        prev.mode !== next.mode ||
        prev.value !== next.value ||
        prev.label !== next.label ||
        prev.disable !== next.disable ||
        prev.readonly !== next.readonly ||
        prev.required !== next.required ||
        prev.maxHeight !== next.maxHeight ||
        prev.hideToolbar !== next.hideToolbar ||
        prev.placeholder !== next.placeholder ||
        prev.errorMessage !== next.errorMessage ||
        prev.onChangeValue !== next.onChangeValue ||
        prev.onBlur !== next.onBlur
    ) {
        return false;
    } else {
        return true;
    }
});
