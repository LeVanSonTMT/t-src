import { NumericFormat } from "react-number-format";
import { memo, ReactNode, useMemo, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField as TextFieldRoot, Typography } from "@mui/material";

import Helpers from "commons/helpers";


interface IOptions {
    maxRows?: number;
    minRows?: number;
    maxLength?: number;

    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;

    iconEnd?: ReactNode;
    iconStart?: ReactNode;

    variant?: "standard" | "outlined";

    unit?: string;
    label?: string;
    value?: any;
    placeholder?: string;
    errorMessage?: string;
    defaultValue?: any;

    onClick?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onBlurValue?: (value: any) => void;
    onChangeValue?: (value: any) => void;
};

type IProps = { type?: 'text' | 'password'; } & IOptions
    | {
        type?: 'number';
        decimalScale?: number;
        maximum?: number;
        minimum?: number;
    } & IOptions;

const CustomTextField = (props: IProps) => {
    const {
        type,
        variant,

        required,
        disabled,
        multiline,

        iconEnd,
        iconStart,
        maxRows,
        minRows,
        maxLength,

        unit,
        label,
        value,
        placeholder,
        errorMessage,
        defaultValue,

        onClick,
        onKeyDown,
        onBlurValue,
        onChangeValue,
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const newLabel = useMemo(() => {
        if (Helpers.isNullOrEmpty(label)) {
            return null;
        } else {
            return `${label} ${required ? "*" : ""}`;
        }
    }, [label, required]);

    const handleInput = (e: any) => {
        if (Helpers.isNullOrEmpty(maxLength)) {
            e.target.value = e.target?.value;
        } else {
            e.target.value = e.target?.value?.toString().slice(0, maxLength);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const myInputProps: any = {
        size: "small",
        value: value,
        label: newLabel,
        fullWidth: true,
        minRows: minRows,
        maxRows: maxRows,
        variant: variant,
        disabled: disabled,
        multiline: multiline,
        helperText: errorMessage,
        placeholder: placeholder,
        defaultValue: defaultValue,
        key: `${label}${defaultValue}`,
        error: !Helpers.isNullOrEmpty(errorMessage),
    };

    if (type === "password") {
        return (
            <TextFieldRoot
                {...myInputProps}
                type={showPassword ? "text" : "password"}
                onKeyDown={onKeyDown}
                onInput={handleInput}
                onBlur={(e: any) => {
                    if (onBlurValue && Helpers.isFunction(onBlurValue)) {
                        onBlurValue(e.target?.value);
                    };
                }}
                onChange={(e: any) => {
                    if (onChangeValue && Helpers.isFunction(onChangeValue)) {
                        onChangeValue(e.target?.value);
                    };
                }}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {iconStart && iconStart}
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge={"end"}
                                    onClick={handleClickShowPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    aria-label={showPassword ? "hide the password" : "display the password"}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        );
    } else if (type === "number") {
        return (
            <NumericFormat
                key={`${label}${defaultValue}`}
                value={value}
                defaultValue={defaultValue}
                customInput={TextFieldRoot}
                decimalScale={props.decimalScale || 0}
                allowNegative={false}
                decimalSeparator={"."}
                thousandSeparator={","}
                allowLeadingZeros
                onBlur={(e) => {
                    if (onBlurValue && Helpers.isFunction(onBlurValue) && (`${e.target?.value}` !== `${defaultValue}`)) {
                        const repValue = e.target?.value ? Number(`${e.target?.value}`.replace(/[.,]/g, "")) : undefined;
                        onBlurValue(repValue);
                    };
                }}
                onValueChange={(values, sourceInfo) => {
                    const { floatValue } = values;
                    if (onChangeValue && Helpers.isFunction(onChangeValue)) {
                        onChangeValue(floatValue ? Number(floatValue) : undefined);
                    };
                }}
                fullWidth
                size={"small"}
                label={newLabel}
                variant={variant}
                disabled={disabled}
                placeholder={placeholder}
                helperText={errorMessage}
                error={!Helpers.isNullOrEmpty(errorMessage)}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {iconStart && iconStart}
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="button">{unit && unit}</Typography>
                                {iconEnd && iconEnd}
                            </InputAdornment>
                        ),
                    },
                }}
                isAllowed={(values) => {
                    const { floatValue } = values;
                    if (!Helpers.isNullOrEmpty(props.minimum) && !Helpers.isNullOrEmpty(props.maximum)) {
                        return (props.minimum <= (floatValue ?? 0)) && ((floatValue ?? 0) <= props.maximum);
                    } else {
                        if (!Helpers.isNullOrEmpty(props.minimum)) {
                            return (props.minimum <= (floatValue ?? 0));
                        } else if (!Helpers.isNullOrEmpty(props.maximum)) {
                            return ((floatValue ?? 0) <= props.maximum);
                        } else {
                            return true;
                        };
                    };
                }}
            />
        );
    } else {
        return (
            <TextFieldRoot
                {...myInputProps}
                type={type}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onInput={handleInput}
                onBlur={(e) => {
                    if (onBlurValue && Helpers.isFunction(onBlurValue)) {
                        onBlurValue(e.target?.value);
                    };
                }}
                onChange={(e) => {
                    if (onChangeValue && Helpers.isFunction(onChangeValue)) {
                        onChangeValue(e.target?.value);
                    };
                }}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {iconStart && iconStart}
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="button">{unit && unit}</Typography>
                                {iconEnd && iconEnd}
                            </InputAdornment>
                        ),
                    },
                }}
            />
        );
    }
};


export default memo(CustomTextField, (prev, next) => {
    if (
        prev.label !== next.label ||
        prev.value !== next.value ||
        prev.required !== next.required ||
        prev.disabled !== next.disabled ||
        prev.placeholder !== next.placeholder ||
        prev.defaultValue !== next.defaultValue ||
        prev.type !== next.type ||
        prev.unit !== next.unit ||
        prev.variant !== next.variant ||
        prev.maxLength !== next.maxLength ||
        prev.errorMessage !== next.errorMessage
    )
        return false;
    return true;
});