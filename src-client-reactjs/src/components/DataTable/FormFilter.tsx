import Drawer from "@mui/material/Drawer";

import { useState } from "react";
import { styled, Theme } from "@mui/material/styles";
import { Close, FilterList, Search } from "@mui/icons-material";
import { Badge, Box, Button, IconButton, TextField, Typography } from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Constants from "constants/constants";



const PopupFilter = styled(Drawer)(({ theme, ownerState }: { theme?: Theme; ownerState: any }) => {
    const { transitions } = theme;
    const { openConfigurator } = ownerState;

    // drawer styles when openConfigurator={true}
    const drawerOpenStyles = () => ({
        right: 0,
        left: "initial",
        transition: transitions.create("right", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });

    // drawer styles when openConfigurator={false}
    const drawerCloseStyles = () => ({
        left: "initial",
        right: Helpers.pxToRem(-350),
        transition: transitions.create("all", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });

    return {
        "& .MuiDrawer-paper": {
            margin: 0,
            height: "100vh",
            padding: `0 ${Helpers.pxToRem(10)}`,
            overflowY: "auto",
            boxShadow: `
            0px 3px 3px -2px rgba(0,0,0,0.2),
            0px 3px 4px 0px rgba(0,0,0,0.14),
            0px 1px 8px 0px rgba(0,0,0,0.12)
            `,
            ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
        },
    };
});

const FormFilter = ({
    children,
    isNotNull,
    searchText,
    widthInputSearch,
    hiddenInputSearch,
    placeholderSearchText,
    onReset,
    onFilter,
    onSearchText,
    onCloseFilter,
    onChangeValueSearchText,
}: {
    children?: React.ReactNode;
    isNotNull?: boolean;
    searchText?: string;
    widthInputSearch?: any;
    hiddenInputSearch?: boolean;
    placeholderSearchText?: string;
    onSearchText?: (value: any) => void;
    onChangeValueSearchText?: (value: string) => void;

    onReset?: () => void;
    onFilter?: () => void;
    onCloseFilter?: () => void;
}) => {

    const [filter, setFilter] = useState(false);

    return (
        <Box gap={1} display="flex" justifyContent="end" alignItems="center">
            {/* Search Text */}
            {!hiddenInputSearch &&
                <Box m={0} p={0} width={{ xs: "auto", sm: widthInputSearch || "250px" }}>
                    <TextField
                        fullWidth
                        size={"small"}
                        key={searchText}
                        variant={"outlined"}
                        defaultValue={searchText || ""}
                        placeholder={placeholderSearchText ? placeholderSearchText : `${Strings.COMMON.ENTER_VALUE}...`}
                        onBlur={(e: any) => {
                            Helpers.isFunction(onChangeValueSearchText) && onChangeValueSearchText(e.target?.value);
                        }}
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                Helpers.isFunction(onSearchText) && onSearchText(e.target?.value);
                                Helpers.isFunction(onChangeValueSearchText) && onChangeValueSearchText(e.target?.value);
                            }
                        }}
                        slotProps={{
                            inputLabel: { shrink: true },
                            input: {
                                startAdornment: (
                                    <IconButton
                                        color="info"
                                        onClick={() => {
                                            Helpers.isFunction(onSearchText) && onSearchText(undefined);
                                        }}
                                    >
                                        <Search />
                                    </IconButton>
                                ),
                                endAdornment: searchText && (
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            Helpers.isFunction(onSearchText) && onSearchText(undefined);
                                            Helpers.isFunction(onChangeValueSearchText) && onChangeValueSearchText(undefined);
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                ),
                            }
                        }}
                    />
                </Box>
            }
            {/* Icon Filter */}
            {Helpers.isFunction(onFilter) &&
                <IconButton
                    onClick={() => setFilter(!filter)}
                    sx={{
                        p: "4px",
                        border: `1px solid #0000003b`,
                        bgcolor: isNotNull ? Constants.Colors.disable.main : "transparent",
                        ".MuiBadge-badge": {
                            width: "14px",
                            height: "14px",
                            borderRadius: "7px",
                        },
                    }}
                >
                    <Badge
                        color={"error"}
                        variant={isNotNull ? "dot" : "standard"}
                    >
                        <FilterList sx={{ m: "3px" }} />
                    </Badge>
                </IconButton>
            }
            {filter &&
                <PopupFilter
                    open={filter}
                    // variant={"permanent"}
                    onClose={() => {
                        setFilter(false);
                        Helpers.isFunction(onCloseFilter) && onCloseFilter();
                    }}
                    ownerState={{ openConfigurator: filter }}
                >
                    <Box width={{ xs: "280px", sm: "360px" }} alignItems={"center"} padding={2}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant={"h6"} fontWeight={"bold"}>{Strings.COMMON.FILTER}</Typography>
                            <IconButton
                                style={{ padding: 0 }}
                                onClick={() => {
                                    setFilter(false);
                                    Helpers.isFunction(onCloseFilter) && onCloseFilter();
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        <Box my={2}>{children && children}</Box>
                        <Box
                            sx={{
                                p: 2,
                                gap: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#fff",
                                position: "absolute",
                                zIndex: 100,
                                bottom: 0,
                                right: 0,
                                left: 0,
                            }}
                        >
                            <Button
                                variant={"contained"}
                                sx={{ width: "98px", bgcolor: Constants.Colors.btn_back }}
                                onClick={() => {
                                    setFilter(false);
                                    Helpers.isFunction(onReset) && onReset();
                                }}
                            >
                                {`${Strings.COMMON.RESET}`}
                            </Button>
                            <Button
                                variant={"contained"}
                                sx={{ width: "98px" }}
                                onClick={() => {
                                    setFilter(false);
                                    onFilter();
                                }}
                            >
                                {Strings.COMMON.SEARCH}
                            </Button>
                        </Box>
                    </Box>
                </PopupFilter>
            }
        </Box>
    );
};

export default FormFilter;