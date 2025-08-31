import { useSelector } from "react-redux";
import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Grid, useMediaQuery } from "@mui/material";

import Helpers from "commons/helpers";
import Screens from "constants/screens";
import Strings from "constants/strings";
import MenuBar from "components/MenuBar";
import Constants from "constants/constants";
import CustomBreadCrumbs from "components/CustomBreadCrumbs";

import { RootState } from "store";
import { useRenderMenus } from "routes/menus";
import { ColorButton, ITitleRoute, VariantButton } from "commons/interfaces";



interface IProps {
    title?: string;
    route?: ITitleRoute[];
    children: React.ReactNode;
    listActions?: {
        color?: ColorButton;
        title?: React.ReactNode;
        variant?: VariantButton;
        onPress?: (data: any) => void;
    }[];
};

const SettingLayout = (props: IProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const listPathName = useSelector((state: RootState) => state.common.listPathName);

    const menus = useRenderMenus(0);

    const wSM = useMediaQuery("(max-width: 900px)");

    const onMenuNavigate = useCallback((pathName: string) => {
        navigate(pathName);
    }, [navigate]);

    const onChangeDisplayLanguage = useCallback((value: string) => {
        Strings.setLanguage(value);
        Helpers.setItemInLocalStorage(Constants.StorageKeys.LANGUAGE, value);

        __EventEmitter.emit(Constants.EventName.LANGUAGE_CHANGE);
    }, []);

    return (
        <Grid container spacing={3} alignItems={"stretch"}>
            <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>
                <Box
                    boxShadow={1}
                    borderRadius={"4px"}
                    mt={{ sm: "0px", md: "79.31px" }}
                    bgcolor={{ sm: "transparent", md: "#ffffff" }}
                    height={{ sm: "auto", md: "calc(100% - 79.31px)" }}
                >
                    <MenuBar
                        openMenu
                        routes={menus}
                        modeSelected={wSM}
                        borderRadius={"4px"}
                        pathNameDefault={Screens.HOME}
                        pathNameCurrent={location?.pathname}
                        listPathName={[...listPathName || []]}

                        hiddenSwitchLanguage
                        onNavigate={onMenuNavigate}
                        onChangeLanguage={onChangeDisplayLanguage}

                        color={{
                            text: "#000000",
                            hoverText: "#ffffff",
                            activeText: "#ffffff",
                            background: "#ffffff",
                            hoverMenu: Constants.Colors.primary.focus,
                            activeMenu: Constants.Colors.primary.main,
                            activeSubMenu: Constants.Colors.primary.main,
                        }}
                    />
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9 }} >
                <Box mb={3}>
                    <CustomBreadCrumbs
                        title={props.title}
                        routes={props.route}
                        pathHome={Screens.HOME}
                        onNavigate={(pathName) => { navigate(pathName); }}
                    />
                </Box>
                {[...props.listActions || []].length > 0 &&
                    <Box sx={{
                        mb: 2,
                        gap: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "end",
                    }}>
                        {[...props.listActions || []].map((item, index) => (
                            <Button
                                key={index}
                                color={item.color}
                                onClick={item.onPress}
                                variant={item.variant}
                            >
                                {item.title}
                            </Button>
                        ))}
                    </Box>
                }
                {props.children}
            </Grid>
        </Grid>
    );
};

export default SettingLayout;
