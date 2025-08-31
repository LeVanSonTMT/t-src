import 'moment/locale/vi';
import 'moment/locale/en-au';

import { RootState } from "store";
import { useSelector } from "react-redux";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { AppBar as MuiAppBar, Drawer as MuiDrawer, Box as MuiBox, useMediaQuery } from "@mui/material";

import Helpers from 'commons/helpers';
import Navbar from "components/Navbar";
import Strings from 'constants/strings';
import Screens from 'constants/screens';
import MenuBar from 'components/MenuBar';
import Resources from 'commons/resources';
import Constants from "constants/constants";
import FooterApp from 'components/FooterApp';
import { IMenuItem } from 'commons/interfaces';


const drawerWidth = "276px";

const boxShadow2 = `var(--mui-shadows-2, 0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12))`;

const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
});

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
};

const MobileAppBar = styled(MuiAppBar)({
    minHeight: "96px",
    backgroundColor: "transparent",
});

const DesktopAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    boxShadow: boxShadow2,
    zIndex: theme.zIndex.drawer,
    backgroundColor: "#ffffff",
    top: "16px",
    left: `calc(${theme.spacing(12)} + 56px)`,
    right: "24px",
    minHeight: "96px",
    borderRadius: "0.75rem",
    width: `calc(100% - (${theme.spacing(12)} + 1px) - 80px)`,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        left: `calc(${drawerWidth} + 24px)`,
        width: `calc(100% - ${drawerWidth} - 48px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const MobileDrawer = styled(MuiDrawer)(({ theme, ownerState }: { theme?: Theme | any; ownerState: any }) => {
    const { color } = ownerState;
    return {
        "& .MuiDrawer-paper": {
            width: drawerWidth,
            zIndex: 1200,
            margin: "1rem",
            overflow: "auto",
            borderRadius: "1rem",
            backgroundSize: "cover",
            boxSizing: "border-box",
            maxHeight: `calc(100% - 2rem)`,
            backgroundColor: color ?? "#ffffff",
        },
    };
});

const DesktopDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, ownerState }: { theme?: Theme | any; ownerState: any }) => {
    const { open, color } = ownerState;

    return {
        flexShrink: 0,
        height: "100vh",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        ...(open && {
            width: drawerWidth,
            ...openedMixin(theme),
            "& .MuiDrawer-paper": {
                ...openedMixin(theme),
                border: "none",
                marginTop: "1rem",
                marginLeft: "1rem",
                width: `calc(${drawerWidth} - 1rem)`,
                boxShadow: boxShadow2,
                maxHeight: `calc(100% - 2rem)`,
                borderRadius: "0.75rem",
                backgroundColor: color ?? "#ffffff",
            },
        }),
        ...(!open && {
            width: `calc(${theme.spacing(12)} + 1px + 2rem)`,
            ...closedMixin(theme),
            "& .MuiDrawer-paper": {
                ...closedMixin(theme),
                border: "none",
                marginTop: "1rem",
                marginLeft: "1rem",
                boxShadow: boxShadow2,
                width: `calc(${theme.spacing(12)} + 1px + 1rem)`,
                maxHeight: `calc(100% - 2rem)`,
                borderRadius: "0.75rem",
                backgroundColor: color ?? "#ffffff",
            },
        }),
    };
});

interface IProps {
    routes: IMenuItem[];
    window?: () => Window;
}

const MainLayoutMenu = (props: IProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const elementRef = useRef(null);

    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const matches = useMediaQuery("(min-width: 575px)");
    const matchesMaxWidth768px = useMediaQuery("(max-width: 768px)");

    const [flexContent, setFlexContent] = useState<any>(false);
    const [valueMarginTop, setValueMarginTop] = useState<any>(96);
    const heightHeaderMobile = document.getElementById("id_header_mobile")?.clientHeight;
    const heightHeaderDesktop = document.getElementById("id_header_desktop")?.clientHeight;

    const container = props.window !== undefined ? () => props.window().document.body : undefined;

    const { listPathName } = useSelector((state: RootState) => state.common);

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
        setOpen(!open);
    };

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {

        const updateElementSize = () => {
            const a = document.getElementById("id_header_mobile")?.clientHeight;
            const b = document.getElementById("id_header_desktop")?.clientHeight;
            const m = document.getElementById("id_main")?.clientHeight;
            const f = document.getElementById("id_footer")?.clientHeight;
            const c = document.getElementById("id_content")?.clientHeight;

            const mt = getHeightHeader(a, b);
            setValueMarginTop(mt);

            if ((c + f) < m) {
                setFlexContent(true);
            } else {
                setFlexContent(false);
            };

            if (elementRef && elementRef.current) {

            } else {

            }
        };
        // Add event listener to update element size on window resize
        window.addEventListener("resize", updateElementSize);
        // Initial update
        updateElementSize();
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", updateElementSize);
        };
    }, []);

    useEffect(() => {
        setIsMobile(matchesMaxWidth768px);
    }, [matchesMaxWidth768px]);

    useEffect(() => {
        if (matches) {
            mobileOpen && setMobileOpen(false);
        } else {
            setMobileOpen(false);
            setOpen(false);
        }
    }, [matches]);

    useEffect(() => {
        setValueMarginTop(getHeightHeader(heightHeaderMobile, heightHeaderDesktop));
    }, [heightHeaderMobile, heightHeaderDesktop]);

    const getHeightHeader = (headerMobile?: number, headerDesktop?: number) => {
        if (headerMobile < 0 || headerDesktop < 0) {
            if (headerMobile > 0) {
                return headerMobile;
            }
            if (headerDesktop > 0) {
                return headerDesktop;
            }
        } else {
            if (headerMobile > headerDesktop) {
                return headerMobile;
            } else {
                return headerDesktop;
            }
        }
    };

    const onChangeDisplayLanguage = useCallback((value: string) => {
        Strings.setLanguage(value);
        Helpers.setItemInLocalStorage(Constants.StorageKeys.LANGUAGE, value);

        __EventEmitter.emit(Constants.EventName.LANGUAGE_CHANGE);
    }, []);

    return (
        <MuiBox
            ref={elementRef}
            sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "unset",
            }}
        >
            <MobileAppBar
                id="id_header_mobile"
                sx={
                    isMobile
                        ? {
                            display: "block",
                            position: "relative",
                        }
                        : {
                            position: "absolute",
                            display: {
                                xs: {
                                    ml: { sm: `${drawerWidth}` },
                                    width: { sm: `calc(100% - ${drawerWidth})` },
                                },
                                sm: "none",
                                md: "none",
                            },
                        }
                }
            >
                {isMobile &&
                    <Navbar
                        allowMenu
                        openMenu={!open}
                        handleDrawerToggle={handleMobileDrawerToggle}
                    />
                }
            </MobileAppBar>

            <DesktopAppBar
                id={"id_header_desktop"}
                open={open}
                position={"absolute"}
                sx={{
                    display: isMobile
                        ? "none"
                        : {
                            xs: "none",
                            sm: "block",
                            md: "block",
                        },
                }}
            >
                {!isMobile &&
                    <Navbar
                        allowMenu
                        openMenu={!open}
                        handleDrawerToggle={handleDrawerToggle}
                    />
                }
            </DesktopAppBar>

            <MobileDrawer
                open={mobileOpen}
                variant={"temporary"}
                container={container}
                ModalProps={{ keepMounted: true }}
                onClose={handleMobileDrawerToggle}
                ownerState={{ open: mobileOpen, color: "dark" }}
                sx={{
                    display: isMobile
                        ? "block"
                        : {
                            xs: "block",
                            sm: "none",
                        },
                }}
            >
                <MenuBar
                    routes={props.routes}
                    openMenu={mobileOpen}

                    logoApp={Resources.Images.LOGO}
                    titleApp={Strings.APP.TITLE_APP}

                    pathNameDefault={Screens.HOME}
                    pathNameCurrent={location?.pathname}
                    listPathName={[...listPathName || []]}

                    hiddenSwitchLanguage
                    onNavigate={(p) => navigate(p)}
                    onChangeLanguage={onChangeDisplayLanguage}
                    handleDrawerToggle={handleMobileDrawerToggle}

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
            </MobileDrawer>

            <DesktopDrawer
                variant={"permanent"}
                ownerState={{ open: open, color: "dark" }}
                sx={{
                    display: isMobile
                        ? "none"
                        : {
                            xs: "none",
                            sm: "block",
                        },
                }}
            >
                <MenuBar
                    openMenu={open}
                    routes={props.routes}

                    logoApp={Resources.Images.LOGO}
                    titleApp={Strings.APP.TITLE_APP}

                    pathNameDefault={Screens.HOME}
                    pathNameCurrent={location?.pathname}
                    listPathName={[...listPathName || []]}

                    hiddenSwitchLanguage
                    onNavigate={(p) => navigate(p)}
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
            </DesktopDrawer>

            {/* Child screen element */}
            <MuiBox
                id={"id_main"}
                component={"main"}
                // key={`${valueMarginTop}`}
                sx={({ breakpoints }: Theme) =>
                    isMobile
                        ? {
                            width: "100%",
                            flexGrow: 1,
                            marginTop: "16px",
                            ...(flexContent && {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            })
                        }
                        : {
                            flexGrow: 1,
                            marginTop: `calc(${Math.max(valueMarginTop, 96)}px + 16px)`,
                            [breakpoints.up(1024)]: {
                                marginTop: `calc(${Math.max(valueMarginTop, 96)}px + 16px)`,
                            },
                            [breakpoints.between(900, 1024)]: {
                                flexDirection: !open ? "row" : "column",
                                marginTop: !open
                                    ? `calc(${Math.max(valueMarginTop, 96)}px + 16px)`
                                    : `calc(${Math.max(valueMarginTop, 96)}px + 16px)`,
                            },
                            width: {
                                xs: "100%",
                                sm: `calc(100% - ${drawerWidth})`,
                            },
                            ...(flexContent && {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            })
                        }
                }
            >
                <MuiBox id={"id_content"} >
                    <Outlet />
                </MuiBox>
                <MuiBox
                    id={"id_footer"}
                    sx={{
                        boxShadow: 2,
                        marginLeft: { xs: "0px", sm: "24px" },
                        marginRight: { xs: "0px", sm: "24px" },
                        marginBottom: { xs: "0px", sm: "16px" },
                        borderRadius: { xs: "0px", sm: "0.75rem" },
                        backgroundColor: "#ffffff",
                    }}
                >
                    <FooterApp />
                </MuiBox>
            </MuiBox>
        </MuiBox >
    );
};

export default MainLayoutMenu;
