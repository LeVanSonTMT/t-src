import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Menu, Typography, useMediaQuery } from "@mui/material";
import { AccountCircle, ArrowDropDown, ArrowDropUp, Logout, Menu as IconMenu, MenuOpen as IconMenuOpen } from "@mui/icons-material";

import Helpers from "commons/helpers";
import Screens from "constants/screens";
import Strings from "constants/strings";
import Resources from "commons/resources";
import Constants from "constants/constants";
import CustomAvatar from "components/CustomAvatar";
import CustomMenuItem from "components/CustomMenuItem";
import CustomBreadCrumbs from "components/CustomBreadCrumbs";

import { RootState } from "store";
import { resetUser } from "store/slice/user.slice";
import { useMaterialUIController } from "components/context";
import { navbar, navbarContainer, styleIconButton, styleBoxPopper } from "components/Navbar/styles";



const Navbar = (props: {
    openMenu?: boolean;
    allowMenu?: boolean;
    allowLogo?: boolean;
    handleDrawerToggle?: () => void;
}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const anchorEl = useRef<HTMLButtonElement>(null);

    const user = useSelector((state: RootState) => state.user);
    const { routes, titleScreen } = useSelector((state: RootState) => state.common);

    const [controller] = useMaterialUIController();
    const { transparentNavbar, darkMode } = controller;

    const w768 = useMediaQuery("(max-width: 768px)");
    const w575 = useMediaQuery("(max-width: 575px)");

    const [openDropDown, setOpenDropDown] = useState<any>(false);

    const handleCloseMenu = () => setOpenDropDown(false);
    const handleOpenMenu = (event: any) => setOpenDropDown(anchorEl.current);

    const handleLogout = () => {
        Helpers.showConfirmAlert({
            message: Strings.MESSAGE.CONFIRM_LOGOUT,
            onOk: () => {
                sessionStorage.clear();

                localStorage.clear();

                dispatch(resetUser());
            },
        });
    };

    const iconsStyle = () => ({
        color: () => {
            let colorValue = darkMode ? "#ffffff" : Constants.Colors.dark.main;
            if (transparentNavbar) {
                colorValue = darkMode ? Helpers.rgba(Constants.Colors.text.main, 0.6) : Constants.Colors.text.main;
            }
            return colorValue;
        },
    });

    const withItem = useMemo(() => w768 ? "auto" : (props.allowMenu ? "auto" : "268px"), [w768, props.allowMenu]);

    return (
        <AppBar
            color={"inherit"}
            position={"static"}
            sx={(theme) => navbar(theme, { transparentNavbar })}
        >
            <Toolbar sx={(theme) => navbarContainer(theme)}>
                <Box sx={{
                    width: withItem,
                    display: "flex",
                    alignItems: "center",
                }}>
                    {props.allowMenu &&
                        <Box sx={{
                            pl: 2,
                            gap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}>
                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                <CustomBreadCrumbs
                                    routes={routes}
                                    title={titleScreen}
                                    pathHome={Screens.HOME}
                                    onNavigate={(pathName) => { navigate(pathName) }}
                                />
                            </Box>
                            <IconButton
                                onClick={props.handleDrawerToggle}
                                sx={{
                                    bgcolor: Constants.Colors.f3,
                                    border: `1px solid ${Constants.Colors.disable.main}`,
                                }}
                            >
                                {props.openMenu
                                    ? <IconMenu htmlColor="#000" sx={{ width: "28px", height: "28px" }} />
                                    : <IconMenuOpen htmlColor="#000" sx={{ width: "28px", height: "28px" }} />
                                }
                            </IconButton>
                        </Box>
                    }
                    {props.allowLogo &&
                        <Box
                            onClick={() => { navigate(Screens.HOME); }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                "&:hover": { cursor: "pointer" },
                                "#text_logo": {
                                    width: "150px",
                                    height: "50px",
                                    display: { xs: "none", md: "block" },
                                },
                                "#icon_logo": {
                                    width: { xs: "60px", md: "80px" },
                                    height: { xs: "60px", md: "80px" },
                                },
                            }}
                        >
                            <img
                                id="icon_logo"
                                width={"80px"}
                                height={"80px"}
                                alt={"icon_logo_menu"}
                                src={Resources.Images.LOGO}
                            />
                        </Box>
                    }
                </Box>

                {/* <Box display={{ xs: "none", sm: "none", md: "inline-block" }}>
                    <Typography
                        variant="h4"
                        color="primary"
                        sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase !important",
                        }}
                    >
                        {Strings.APP.TITLE_APP}
                    </Typography>
                </Box> */}

                {/* User Info */}
                <Box
                    color={"inherit"}
                    sx={{
                        width: withItem,
                        display: "flex",
                        justifyContent: "end",
                    }}
                >
                    <>
                        <IconButton
                            size="large"
                            disableRipple
                            ref={anchorEl}
                            sx={styleIconButton}
                            onClick={handleOpenMenu}
                        >
                            <CustomAvatar
                                sx={iconsStyle}
                                text={user?.userInfo?.fullName}
                                src={Resources.Images.AVATAR_THUMBNAIL}
                                style={{
                                    width: 55, height: 55,
                                    border: `1px solid ${Constants.Colors.f3}`,
                                }}
                            />
                            {!w575 && (
                                <Box
                                    sx={{
                                        mr: 1,
                                        gap: 0.5,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        color="textPrimary"
                                        sx={{
                                            maxWidth: "220px",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            fontSize: "1rem",
                                            textAlign: "left",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {user?.userInfo?.fullName}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        sx={{
                                            maxWidth: "220px",
                                            overflow: "hidden",
                                            fontSize: "0.785rem",
                                            textAlign: "left",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user?.userInfo?.accountCode}
                                    </Typography>
                                </Box>
                            )}
                            {Boolean(openDropDown) ? <ArrowDropUp /> : <ArrowDropDown />}
                        </IconButton>
                        <Menu
                            anchorEl={openDropDown}
                            anchorReference={null}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            open={Boolean(openDropDown)}
                            onClose={handleCloseMenu}
                        >
                            <Box sx={styleBoxPopper}>
                                {/* {w575 && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            padding: "6px 16px",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography
                                            color="textPrimary"
                                            sx={{
                                                maxWidth: "220px",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                fontSize: "1rem",
                                                textAlign: "left",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {user?.userInfo?.fullName}
                                        </Typography>
                                        <Typography
                                            color="textPrimary"
                                            sx={{
                                                maxWidth: "220px",
                                                overflow: "hidden",
                                                fontSize: "0.785rem",
                                                textAlign: "left",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {user?.userInfo?.accountCode}
                                        </Typography>
                                    </Box>
                                )} */}
                                <CustomMenuItem
                                    key={"acc_info"}
                                    maxWidth={"250px"}
                                    title={Strings.PROFILE.ACCOUNT_INFO}
                                    icon={<AccountCircle fontSize="small" />}
                                    onClick={() => {
                                        navigate(Screens.PROFILE);
                                        setOpenDropDown(false);
                                    }}
                                />
                                <CustomMenuItem
                                    key={"log_out"}
                                    maxWidth={"250px"}
                                    title={Strings.LOGIN.LOGOUT}
                                    icon={<Logout fontSize="small" />}
                                    onClick={() => {
                                        handleLogout();
                                        setOpenDropDown(false);
                                    }}
                                />
                            </Box>
                        </Menu>
                    </>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
