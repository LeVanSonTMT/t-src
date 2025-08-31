import moment from "moment";
import { useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker as DatePickerRoot } from "@mui/x-date-pickers/DatePicker";

import Helpers from "commons/helpers";
import Strings from "constants/strings";

moment.locale("vi");

type IDateView = "year" | "month" | "day";

const weekdayLabels_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const weekdayLabels_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface IProps {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    variant?: "standard" | "outlined";

    value?: any;
    minDate?: any;
    maxDate?: any;
    views?: IDateView[];
    errorMessage?: string;
    onChangeValue?: (value: any) => void;
};

const CustomDatePicker = ({
    label,
    views = ["year", "month", "day"],
    variant,
    required,
    disabled,
    placeholder,
    errorMessage,
    onChangeValue,
    ...rest
}: IProps) => {

    const langCurrent = Strings.getLanguage();

    const value = useMemo(() => (
        (
            Helpers.isNullOrEmpty(rest.value)
            || (rest.value === "0")
            || (rest.value === 0)
        ) ? undefined : moment(Number(rest.value) * 1000)
    ), [rest.value]);

    const newLabel = useMemo(() => {
        if (Helpers.isNullOrEmpty(label)) {
            return null;
        } else {
            return `${label} ${required ? "*" : ""}`;
        }
    }, [label, required]);

    return (
        <LocalizationProvider
            dateAdapter={AdapterMoment}
            dateFormats={{ keyboardDate: "DD/MM/YYYY" }}
            adapterLocale={(langCurrent === "vi") ? "vi" : "en-au"}
        >
            <DatePickerRoot
                {...rest}
                key={newLabel}
                views={views}
                value={value}
                label={newLabel}
                disabled={disabled}
                sx={{ width: "100%" }}
                onChange={(newValue: any) => {
                    if (Helpers.isFunction(onChangeValue)) {
                        const result = newValue ? moment(newValue).unix() : undefined;
                        onChangeValue(result);
                    } else { };
                }}
                dayOfWeekFormatter={(date: any) => {
                    const idx = moment(date).day();
                    if (langCurrent === "vi") {
                        return weekdayLabels_VI[idx];
                    } else {
                        return weekdayLabels_EN[idx];
                    }
                }}
                slotProps={{
                    textField: {
                        size: "small",
                        fullWidth: true,
                        helperText: errorMessage,
                        placeholder: placeholder,
                        inputProps: { readOnly: true },
                        InputLabelProps: { shrink: true },
                        error: !Helpers.isNullOrEmpty(errorMessage),
                    },
                    field: { clearable: true },
                    // actionBar: {
                    //     actions: ["clear"],
                    // },
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomDatePicker;