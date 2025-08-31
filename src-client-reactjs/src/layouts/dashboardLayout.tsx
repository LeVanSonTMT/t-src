import { RootState } from "store";
import { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Typography } from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Loading from "components/Loading";
import Constants from "constants/constants";
import SettingLayout from "./settingLayout";
import CustomAlert from "components/CustomAlert";

import { resetDataAlert } from "store/slice/common.slice";
import { updateTitleRoute } from "store/slice/common.slice";
import { ColorButton, ITitleRoute, VariantButton } from "commons/interfaces";



interface IProps {
    title?: string;
    route?: ITitleRoute[];
    children: ReactNode;

    // Cần có quyền mới hiện children
    isPermission: boolean;
    allowSettingLayout?: boolean;

    listActions?: {
        title?: ReactNode;
        color?: ColorButton;
        variant?: VariantButton;
        onPress?: (data: any) => void;
    }[];
};

const DashboardLayout = ({
    title,
    route,
    children,
    listActions,
    isPermission,
    allowSettingLayout,
}: IProps) => {

    const dispatchRedux = useDispatch();

    const { dataAlert, loading } = useSelector((state: RootState) => state.common);

    useEffect(() => {
        dispatchRedux(
            updateTitleRoute({
                routes: route || [],
                titleScreen: title || "",
                targerScreen: `${window.location.pathname}${window.location.search}`,
            })
        );
        // Helpers.setItemInLocalStorage(
        //     Constants.StorageKeys.FROM,
        //     `${window.location.pathname}${window.location.search}`
        // );
    }, [title, route]);

    const renderContentView = () => {
        if (isPermission) {
            return allowSettingLayout
                ? (
                    <SettingLayout
                        title={title}
                        route={route}
                        children={children}
                        listActions={listActions}
                    />
                )
                : (
                    <Box>
                        {/* <Box mb={3}>
                            <CustomBreadCrumbs
                                title={title}
                                routes={route}
                                pathHome={Screens.HOME}
                                onNavigate={(pathName) => { }}
                            />
                        </Box> */}
                        {[...listActions || []].length > 0 &&
                            <Box sx={{
                                mb: 2,
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "end",
                            }}>
                                {[...listActions || []].map((item, index) => (
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
                        {children}
                    </Box>
                );
        } else {
            return (
                <Box sx={{
                    gap: "8px",
                    display: "flex",
                    minHeight: "60vh",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    <Box sx={{
                        display: "flex",
                        marginTop: "16px",
                        marginBottom: "16px",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Box sx={{
                            width: "99px",
                            height: "99px",
                            display: "flex",
                            textAlign: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `0.35em solid ${Constants.Colors.warning.focus}`,
                            borderRadius: "50%",
                        }}>
                            <Box sx={{ color: Constants.Colors.warning.focus, fontSize: "3.75rem" }}>!</Box>
                        </Box>
                    </Box>
                    <Box sx={{ gap: 0.5, display: "grid", textAlign: "center" }}>
                        <Typography variant="h6" color="textSecondary">
                            {Strings.MESSAGE.NOT_PERMISSION}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <div id="DashboardLayout">
            <Loading visible={loading} />

            <CustomAlert
                dataAlert={dataAlert}
                autoHideDuration={6000}
                open={!Helpers.isNullOrEmpty(dataAlert?.message)}
                onClose={() => { dispatchRedux(resetDataAlert()); }}
            />

            <Box
                sx={({ breakpoints, transitions }) => ({
                    px: 3,
                    py: 3,
                    position: "relative",
                    [breakpoints.up("xl")]: {
                        transition: transitions.create(["margin-left", "margin-right"], {
                            easing: transitions.easing.easeInOut,
                            duration: transitions.duration.standard,
                        }),
                    },
                })}
            >
                {/* {!Helpers.isNullOrEmpty(user?.userInfo?.id) && renderContentView()} */}
                {renderContentView()}
            </Box>
        </div>
    );
};

export default DashboardLayout;