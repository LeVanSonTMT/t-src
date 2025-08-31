import moment from "moment";
import Inputmask from "inputmask";
import { Close } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";

import Helpers from "commons/helpers";



const CustomInputDate = (props: {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    variant?: "standard" | "outlined";

    value?: any;
    errorMessage?: string;
    onChangeValue?: (value: any) => void;
}) => {

    const inputRef = useRef(null);

    const [valueDate, setValueDate] = useState("");
    const [errorDate, setErrorDate] = useState("");

    useEffect(() => {
        if (
            (props.value === 0) ||
            (props.value === "0") ||
            Helpers.isNullOrEmpty(props.value)
        ) {
            setErrorDate("");
            setValueDate("");
        } else {
            const valFormatMoment = moment(Number(props.value) * 1000).format("DD/MM/YYYY");
            setValueDate(valFormatMoment);
            setErrorDate("");
        };
    }, [props.value]);

    useEffect(() => {
        if (inputRef.current) {
            Inputmask({
                mask: "99/99/9999",
                placeholder: "dd/mm/yyyy",
                showMaskOnFocus: true,
                showMaskOnHover: false,
            }).mask(inputRef.current);
        }
    }, []);

    const handleValidateValue = (dateString: any) => {
        const parts = dateString.split("/");

        const day = parts?.[0];
        const year = parts?.[2];
        const month = parts?.[1];

        // Kiểm tra ngày
        if (!Helpers.isNullOrEmpty(day) && day.length === 2) {
            if (Number(day) < 1 || Number(day) > 31) {
                return { check: false, holdPos: 0 };
            } else { };
        };

        // Kiểm tra tháng
        if (!Helpers.isNullOrEmpty(month) && month.length === 2) {
            if (Number(month) < 1 || Number(month) > 12) {
                return { check: false, holdPos: 3 };
            } else { };
        };

        // Kiểm tra năm
        if (year && year.length === 4) {
            const arr = year.toString().split("").map(Number);
            if (!Helpers.isNullOrEmpty(arr?.[0]) && Number(arr?.[0]) < 1) {
                return { check: false, holdPos: 6 };
            } else if (Number(arr?.[0]) === 1 && !Helpers.isNullOrEmpty(arr?.[1]) && Number(arr?.[1]) < 9) {
                return { check: false, holdPos: 7 };
            } else { };
        };

        return { check: true, holdPos: null };
    };

    const handleKeyUp = (event: any) => {
        const newValue = event.target.value;
        const newInputCurrent = inputRef.current;
        const result = handleValidateValue(newValue);

        setErrorDate("");

        if (Helpers.isNullOrEmpty(newValue)) {
            setValueDate("");
            props.onChangeValue && props.onChangeValue(newValue);
        } else {
            // Chỉ setValue nếu hợp lệ ở từng bước nhập
            if (result?.check) {
                setValueDate(newValue);
                if (Helpers.isValidDate(newValue)) {
                    let valFormatMoment = moment(newValue, "DD/MM/YYYY");
                    if (!valFormatMoment.isValid()) {
                        setErrorDate("Ngày không hợp lệ");
                    } else {
                        props.onChangeValue
                            && props.onChangeValue(valFormatMoment.unix());
                    };
                };
            } else {
                // Nếu nhập sai thì reset lại input thành value cũ
                event.target.value = valueDate;
                // Chọn lại phần sai
                newInputCurrent.setSelectionRange(result.holdPos, result.holdPos + 2);
            };
        };
    };

    return (
        <TextField
            fullWidth
            type={"text"}
            size={"small"}
            key={props.label}
            label={props.label}
            variant={props.variant}
            required={props.required}
            disabled={props.disabled}
            helperText={errorDate}
            placeholder={props.placeholder}
            error={!Helpers.isNullOrEmpty(errorDate)}
            value={valueDate}
            inputRef={inputRef}
            onInput={handleKeyUp}
            slotProps={{
                inputLabel: { shrink: true },
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            {!Helpers.isNullOrEmpty(valueDate) &&
                                <IconButton onClick={() => {
                                    setValueDate("");
                                    setErrorDate("");
                                    props.onChangeValue && props.onChangeValue(undefined);
                                }}>
                                    <Close />
                                </IconButton>
                            }
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default CustomInputDate;