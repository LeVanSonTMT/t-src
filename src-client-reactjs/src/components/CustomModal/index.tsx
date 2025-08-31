import React, { ReactNode } from "react";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import {
    AppBar, Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Slide, Toolbar, Typography,
} from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Constants from "constants/constants";
import { ColorButton } from "commons/interfaces";



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: ReactNode;
    onClose: () => void;
};

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle
            sx={{
                m: 0, p: 2,
                borderBottom: `1px solid ${Constants.Colors.disable.main}`,
            }}
            {...other}
        >
            {children}
            {onClose ? (
                <IconButton
                    onClick={onClose}
                    aria-label="close"
                    sx={{
                        top: 8,
                        right: 8,
                        position: "absolute",
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

interface IProps {
    title?: string;
    textButtonClose?: string;
    textButtonAction?: string;

    visible: boolean;
    dividers?: boolean;
    fullWidth?: boolean;
    fullScreen?: boolean;
    hasActionButton?: boolean;
    allowOutsideClick?: boolean;
    disabledActionButton?: boolean;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";

    className?: string;
    children: ReactNode;

    colors?: {
        bgcolorTitle?: string;
        bgcolorContent?: string;
    };
    listActions?: {
        title: string;
        color?: ColorButton;
        onPress: () => void;
    }[];

    onClose?: () => void;
    onAction?: () => void;
    onClickCloseIcon?: () => void;
};

const CustomModal = ({
    title,
    colors,
    visible,
    children,
    dividers,
    maxWidth,
    fullWidth,
    className,
    fullScreen,
    textButtonClose,
    textButtonAction,
    hasActionButton,
    disabledActionButton,
    allowOutsideClick = false,
    listActions,
    onClose,
    onAction,
    onClickCloseIcon,
}: IProps) => {

    return (
        <>
            {fullScreen ? (
                <Dialog
                    fullScreen
                    open={visible}
                    className={className}
                    slots={{ transition: Transition }}
                    onClose={allowOutsideClick ? onClose : undefined}
                    sx={{
                        ".MuiDialog-paper": {
                            bgcolor: colors?.bgcolorContent ?? "#ffffff",
                        }
                    }}
                >
                    <AppBar sx={{ position: "relative", bgcolor: "#ffffff", boxShadow: 2 }}>
                        <Toolbar sx={{
                            flexWrap: "wrap",
                            paddingLeft: "16px !important",
                            paddingRight: "1px !important",
                        }}>
                            <Typography sx={{ flex: 1, color: "#000" }} variant="h6">
                                {title}
                            </Typography>

                            <Box sx={{
                                m: "6px 12px",
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                            }}>
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: Constants.Colors.btn_back }}
                                    onClick={() => {
                                        Helpers.isFunction(onClose) && onClose()
                                    }}
                                >
                                    {textButtonClose ? textButtonClose : Strings.COMMON.CLOSE}
                                </Button>
                                {hasActionButton && Helpers.isFunction(onAction) && (
                                    <Button variant="contained" onClick={onAction} disabled={disabledActionButton}>
                                        {textButtonAction ? textButtonAction : Strings.COMMON.OK}
                                    </Button>
                                )}
                                {hasActionButton && [...listActions || []].length > 0 &&
                                    [...listActions || []].map(item => {
                                        if (item) {
                                            return (
                                                <Button variant="contained" color={item.color} onClick={item.onPress}>
                                                    {item.title}
                                                </Button>
                                            );
                                        } else {
                                            return null;
                                        };
                                    })
                                }
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Box padding={2}>{children}</Box>
                </Dialog>
            ) : (
                <BootstrapDialog
                    open={visible}
                    maxWidth={maxWidth}
                    className={className}
                    fullWidth={fullWidth}
                    aria-labelledby={"customized-dialog-title"}
                    onClose={allowOutsideClick ? onClose : undefined}
                >
                    {!Helpers.isNullOrEmpty(title) && (
                        <BootstrapDialogTitle id={"customized-dialog-title"} onClose={onClickCloseIcon ? onClickCloseIcon : onClose}>
                            {title}
                        </BootstrapDialogTitle>
                    )}
                    <DialogContent dividers={dividers}>{children}</DialogContent>
                    {hasActionButton && (
                        <DialogActions>
                            <Box gap={1} display="flex" justifyContent="flex-end" alignItems="flex-end" my={1}>
                                {Helpers.isFunction(onClose) && (
                                    <Button variant="contained" sx={{ bgcolor: Constants.Colors.btn_back }} onClick={onClose}>
                                        {textButtonClose ? textButtonClose : Strings.COMMON.CLOSE}
                                    </Button>
                                )}
                                {Helpers.isFunction(onAction) && (
                                    <Button variant="contained" onClick={onAction} disabled={disabledActionButton}>
                                        {textButtonAction ? textButtonAction : Strings.COMMON.OK}
                                    </Button>
                                )}
                                {[...listActions || []].length > 0 &&
                                    [...listActions || []].map(item => {
                                        if (item) {
                                            return (
                                                <Button variant="contained" color={item.color} onClick={item.onPress}>
                                                    {item.title}
                                                </Button>
                                            );
                                        } else {
                                            return null;
                                        };
                                    })
                                }
                            </Box>
                        </DialogActions>
                    )}
                </BootstrapDialog>
            )}
        </>
    );
};

export default CustomModal;
