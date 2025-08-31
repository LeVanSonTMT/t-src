import { useEffect, useMemo, useRef, useState } from "react";
import { ExpandLess, ExpandMore, KeyboardArrowDown, KeyboardArrowUp, Language, } from "@mui/icons-material";
import { Collapse, Grid, IconButton, List, ListItem, Icon, Box, Typography, Menu, MenuItem } from "@mui/material";

import Resources from "commons/resources";
import Helpers from "../../commons/helpers";
import Constants from "constants/constants";
import Strings from "../../constants/strings";

import { ICodename, IMenuItem } from "../../commons/interfaces";
import {
    listItemMenuStyle,
    iconItemMenuStyle,
    textItemMenuStyle,
    gridMenuBarStyle,
} from "./styles";



interface IProps {
    logoApp?: string;
    titleApp?: string;

    openMenu: boolean;
    routes: IMenuItem[];
    handleDrawerToggle?: () => void;

    hiddenSwitchLanguage?: boolean;
    onChangeLanguage?: (lang: string) => void;

    pathNameCurrent?: string;
    pathNameDefault?: string;
    onNavigate: (pathName: string) => void;
    listPathName?: { pathName: string, query: string, totalCount: number }[];

    borderRadius?: any;
    modeSelected?: boolean;
    disableAction?: boolean;
    color?: {
        background?: string;

        text?: string;
        hoverText?: string;
        activeText?: string;

        hoverMenu?: string;
        activeMenu?: string;
        activeSubMenu?: string;
    };
};

const bgColor = Constants.Colors.f3;

const MenuBar = (props: IProps) => {

    const langCurrent = Strings.getLanguage();

    const mainRoutes = useMemo(() => props.routes, [props.routes]);
    const openMenu = useMemo(() => props.openMenu, [props.openMenu]);

    const pathNameCurrent: string = useMemo(() => (props.pathNameCurrent || "/"), [props.pathNameCurrent]);
    const pathNameDefault: string = useMemo(() => (props.pathNameDefault || "/"), [props.pathNameDefault]);

    const [arrKeySelected, setArrKeySelected] = useState<string[]>([]);
    const [arrKeyOnClicked, setArrKeyOnClicked] = useState<string[]>([]);

    let valueSelected: string[] = [];

    const listMultiLanguage: ICodename[] = [
        { code: Constants.LanguageContent.EN, name: Strings.LANGUAGE.ENGLISH },
        { code: Constants.LanguageContent.VI, name: Strings.LANGUAGE.VIETNAMESE },
    ];

    useEffect(() => {
        const arrPathname = props.pathNameCurrent.split("/").slice(1);
        if (arrPathname.length > 0) {
            onCheckItemMenu(arrPathname, mainRoutes || [], 0);
            setArrKeySelected(valueSelected);
            setArrKeyOnClicked(valueSelected);
        }
    }, [mainRoutes, props.pathNameCurrent]);

    useEffect(() => {
        if (openMenu === false) {
            setArrKeyOnClicked([...arrKeySelected || []]);
        }
    }, [openMenu]);

    const onCheckItemMenu = (arrPathname: string[], dataMenu: IMenuItem[], index: number) => {
        const itemParent = dataMenu.find(el => el.screenPath === pathNameCurrent);

        if (itemParent) {
            const keyValue = !itemParent?.isVisible ? arrPathname[index] : itemParent?.key;
            valueSelected.push(keyValue);
        } else {
            const itemFinded = dataMenu.find(el => el.key === arrPathname[index]);
            const keyValue = !itemFinded?.isVisible ? arrPathname[index] : itemFinded?.key;

            valueSelected.push(keyValue);

            if ((itemFinded?.subMenu || []).length > 0) {
                onCheckItemMenu(arrPathname, itemFinded?.subMenu || [], index + 1);
            }
        }
    };

    const handelOnClickItemMenu = (dataMenu: IMenuItem) => {
        if ([...dataMenu?.subMenu || []].length === 0) {
            const itemPathName = [...props.listPathName || []].find(el => (el.pathName === dataMenu?.screenPath));

            const pathNameNavigate = itemPathName ? (itemPathName?.pathName + itemPathName?.query) : dataMenu?.screenPath;

            Helpers.isFunction(props.handleDrawerToggle) && props.handleDrawerToggle();

            Helpers.isNullOrEmpty(dataMenu?.target)
                ? props.onNavigate(pathNameNavigate)
                : window.open(`${pathNameNavigate}`, `${dataMenu?.target}`);
        } else {
            const arrItemTemp: string[] = [...arrKeyOnClicked || []];
            if (arrItemTemp.findIndex(el => el === dataMenu?.key) === -1) {
                setArrKeyOnClicked([dataMenu?.key]);
            } else {
                const temp = arrItemTemp.filter(el => el !== dataMenu?.key);
                setArrKeyOnClicked(temp);
            };
        };
        setOpenDropDownMenu(false);
    };

    const handelKeyActiveSelected = (valueKey: string) => {
        const valueTemp = arrKeySelected.find(el => valueKey.includes(el));
        return valueTemp ? true : false;
    };

    const handelKeyActiveOnClicked = (valueKey: string) => {
        const valueTemp = arrKeyOnClicked.find(el => valueKey.includes(el));
        return valueTemp ? true : false;
    };

    const renderIconItemMenu = (dataMenu: IMenuItem, ownerState: {
        color?: string,
        isActive: boolean,
        hoverColor?: string,
        colorActive?: string,
    }) => {
        const propsTextIcon: any = {
            variant: "button",
            textTransform: "none",
        };

        if (!dataMenu?.hiddenIcon) {
            if (Helpers.isNullOrEmpty(dataMenu?.icon) && Helpers.isNullOrEmpty(dataMenu?.iconName)) {
                return (
                    <Box className="icon_menu_sl" sx={(theme) => iconItemMenuStyle(theme, ownerState)}>
                        {!props.openMenu ?
                            <Typography {...propsTextIcon} sx={theme => textItemMenuStyle(theme, ownerState)}>
                                {Helpers.removeAccentsFromStrings(`${dataMenu?.title || ""}`.substring(0, 1))}
                            </Typography>
                            : null
                        }
                    </Box>
                );
            } else {
                if (!Helpers.isNullOrEmpty(dataMenu?.iconName)) {
                    return (
                        <Icon className="icon_menu_sl" sx={(theme) => iconItemMenuStyle(theme, ownerState)}>
                            {dataMenu?.iconName}
                        </Icon>
                    );
                }

                if (!Helpers.isNullOrEmpty(dataMenu?.icon)) {
                    return (<Box className="icon_menu_sl" sx={(theme) => iconItemMenuStyle(theme, ownerState)}>{dataMenu?.icon}</Box>);
                }

                return (
                    <Box className="icon_menu_sl" sx={(theme) => iconItemMenuStyle(theme, ownerState)}>
                        {!props.openMenu ?
                            <Typography {...propsTextIcon} sx={theme => textItemMenuStyle(theme, ownerState)}>
                                {Helpers.removeAccentsFromStrings(`${dataMenu.title}`).substring(0, 1).toUpperCase()}
                            </Typography>
                            : null
                        }
                    </Box>
                );
            }
        } else {
            return (
                <Box className="icon_menu_sl" sx={(theme) => iconItemMenuStyle(theme, ownerState)}>
                    {!props.openMenu ?
                        <Typography {...propsTextIcon} sx={theme => textItemMenuStyle(theme, ownerState)}>
                            {Helpers.removeAccentsFromStrings(`${dataMenu.title}`).substring(0, 1).toUpperCase()}
                        </Typography>
                        : null
                    }
                </Box>
            );
        }
    };

    const renderItemMenu = (dataMenu: IMenuItem, level?: number) => {
        const isActive = handelKeyActiveSelected(dataMenu?.key) ? true : false;

        const ownerStateItem = {
            isActive: isActive,
            color: props.color?.text,
            hoverColor: props.color?.hoverText,
            colorActive: props.color?.activeText,
        };

        const ownerStateListItem = {
            openMenu: openMenu,
            isActive: isActive,
            hoverColor: props.color?.hoverText,
            hoverBgColor: props.color?.hoverMenu,
            bgColorItem: props.color?.activeMenu,
            bgColorSubItem: props.color?.activeSubMenu,
        }

        if ([...dataMenu?.subMenu || []].length === 0) {
            return (
                <ListItem
                    key={dataMenu?.key}
                    sx={{
                        py: 1,
                        display: dataMenu?.isVisible ? "block" : "none",
                    }}
                >
                    <IconButton
                        sx={(theme) => listItemMenuStyle(theme, {
                            isParent: false,
                            ...ownerStateListItem
                        })}
                        onClick={() => { !props.disableAction && handelOnClickItemMenu(dataMenu) }}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            maxWidth: `calc(100% - 0px)`,
                            marginLeft: `${level * 24}px`,
                        }}
                        >
                            {renderIconItemMenu(dataMenu, ownerStateItem)}
                            {
                                openMenu &&
                                <Box sx={{ display: "flex", maxWidth: `calc(100% - 28px)` }}>
                                    <Typography
                                        variant="button"
                                        fontWeight="regular"
                                        textTransform="none"
                                        style={{
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                        sx={theme => textItemMenuStyle(theme, ownerStateItem)}
                                    >
                                        {dataMenu?.title}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    </IconButton>
                </ListItem>
            );
        } else {
            return (
                <Box style={{ display: dataMenu?.isVisible ? "block" : "none", }} key={dataMenu?.key} >
                    <ListItem style={{ paddingBottom: "4px", paddingTop: "4px", }}>
                        <IconButton
                            sx={(theme) => listItemMenuStyle(theme, {
                                isParent: true,
                                ...ownerStateListItem,
                            })}
                            onClick={() => { !props.disableAction && handelOnClickItemMenu(dataMenu) }}
                        >
                            <Box style={{
                                display: "flex",
                                alignItems: "center",
                                maxWidth: `calc(100% - 24px)`
                            }}>
                                {renderIconItemMenu(dataMenu, ownerStateItem)}
                                {
                                    openMenu &&
                                    <Box sx={{ display: "flex", maxWidth: `calc(100% - 28px)` }}>
                                        <Typography
                                            variant="button"
                                            fontWeight="regular"
                                            textTransform="none"
                                            style={{
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                            }}
                                            sx={theme => textItemMenuStyle(theme, ownerStateItem)}
                                        >
                                            {dataMenu?.title}
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                            {
                                openMenu &&
                                    handelKeyActiveOnClicked(dataMenu?.key)
                                    ? <ExpandLess
                                        className="icon_menu_sl"
                                        htmlColor={props.color?.text || "#ffffff"}
                                        sx={theme => textItemMenuStyle(theme, ownerStateItem)}
                                    />
                                    : <ExpandMore
                                        className="icon_menu_sl"
                                        htmlColor={props.color?.text || "#ffffff"}
                                        sx={theme => textItemMenuStyle(theme, ownerStateItem)}
                                    />

                            }
                        </IconButton>
                    </ListItem>
                    <Collapse in={handelKeyActiveOnClicked(dataMenu?.key)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                [...dataMenu.subMenu || []].map(itemSubMenu => renderItemMenu(itemSubMenu, level + 1))
                            }
                        </List>
                    </Collapse>
                </Box >
            );
        }
    };

    const wrapperRef = useRef<any>(null);
    const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenDropDownMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    if (props.modeSelected) {
        const itemMenuActive = [...mainRoutes || []].find(el => (
            el.isVisible && el.screenPath &&
            (arrKeySelected?.[0] || "").startsWith(el.key)
        ));

        return (
            <Box style={{ position: "relative", backgroundColor: "transparent" }} ref={wrapperRef}>
                <Box onClick={() => { setOpenDropDownMenu(p => !p); }} >
                    <Box sx={{
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: props.borderRadius || "unset",
                        justifyContent: "space-between",
                        backgroundColor: "#ffffff",
                    }} >
                        <Box sx={{
                            gap: "8px",
                            display: "flex",
                            alignItems: "center",
                        }} >
                            {itemMenuActive?.icon &&
                                <Box
                                    className="icon_menu_sl"
                                    sx={{ width: "24px", height: "24px" }}
                                >
                                    {itemMenuActive?.icon}
                                </Box>
                            }
                            <Typography
                                variant={"button"}
                                fontWeight={"bold"}
                            >
                                {itemMenuActive?.title || ""}
                            </Typography>
                        </Box>
                        {!openDropDownMenu ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                    </Box>
                </Box>
                {openDropDownMenu &&
                    <Box style={{
                        top: "60px",
                        zIndex: 999,
                        width: "100%",
                        padding: "8px",
                        position: "absolute",
                        borderRadius: props.borderRadius || "unset",
                        backgroundColor: "#ffffff",
                    }}>
                        <List>{mainRoutes.map((menuItem) => renderItemMenu(menuItem, 0))}</List>
                    </Box>
                }
            </Box>
        );
    } else {
        return (
            <Grid
                sx={theme => gridMenuBarStyle(
                    theme,
                    ({
                        borderRadius: props.borderRadius || "unset",
                        backgroundColor: props.color?.background || bgColor,
                    })
                )}
            >
                <Grid
                    sx={{
                        borderRadius: props.borderRadius || "unset",
                        backgroundColor: props.color?.background || bgColor,
                    }}
                >
                    {(
                        !Helpers.isNullOrEmpty(props.logoApp) ||
                        !Helpers.isNullOrEmpty(props.titleApp)
                    ) &&
                        <ListItem
                            sx={{
                                paddingTop: "20px",
                                paddingBottom: "0px",
                                justifyContent: "center",
                                ":hover": { cursor: "pointer", }
                            }}
                            onClick={() => { !props.disableAction && props.onNavigate(pathNameDefault) }}
                        >
                            {!props.openMenu
                                ? (
                                    <img
                                        id="icon_logo"
                                        width={"60px"}
                                        height={"60px"}
                                        alt={"icon_logo_menu"}
                                        src={Resources.Images.LOGO}
                                    />
                                )
                                : (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <img
                                            id="text_logo"
                                            width={"150px"}
                                            height={"60px"}
                                            alt={"text_logo_menu"}
                                            src={Resources.Images.LOGO}
                                        />
                                    </Box>
                                )
                            }
                        </ListItem>
                    }
                    <List>{mainRoutes.map((menuItem) => renderItemMenu(menuItem, 0))}</List>
                </Grid>

                {/* Button Switcher Language  */}
                {!props.hiddenSwitchLanguage &&
                    <Grid sx={{
                        display: "flex",
                        padding: "1rem",
                        placeItems: "center",
                        borderRadius: props.borderRadius || "unset",
                        justifyContent: openMenu ? "normal" : "center",
                        backgroundColor: props.color?.background || bgColor,
                    }} >
                        <ButtonSwitcherLanguage
                            language={langCurrent}
                            listMultiLanguage={listMultiLanguage}
                            isMiniSideNav={!openMenu}
                            color={props.color?.text}
                            disableAction={props.disableAction}
                            background={props.color?.background || bgColor}
                            handleOnChange={(valLanguage) => {
                                if (Helpers.isFunction(props.onChangeLanguage)) {
                                    props.onChangeLanguage(valLanguage);
                                }
                            }}
                        />
                    </Grid>
                }
            </Grid>
        );
    };

};

export default MenuBar;



const ButtonSwitcherLanguage = (props: {
    color?: string;
    background?: string;
    isMiniSideNav?: boolean;
    disableAction?: boolean;
    language: string;
    listMultiLanguage: ICodename[];
    handleOnChange: (lang: string) => void;
}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const languageTitles: { [key: string]: any } = useMemo(() => {
        let newData: any;

        props.listMultiLanguage.forEach(item => {
            newData = {
                ...newData,
                [item.code]: {
                    title: item.name,
                    miniTitle: item.code,
                }
            };
        });

        return newData;
    }, [props.listMultiLanguage]);

    const languageTitle = useMemo(() => (
        props.isMiniSideNav
            ? languageTitles[props.language].miniTitle
            : languageTitles[props.language].title
    ), [props.isMiniSideNav, languageTitles, props.language]);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang: string) => {
        setAnchorEl(null);
        props.handleOnChange(lang);
    };

    return (
        <Box sx={{
            px: 4,
            py: 2,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            width: "100%",
            display: "flex",
            position: "sticky",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
        }}>
            <Box
                id="language_button"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                aria-controls={open ? "language_app" : undefined}
                onClick={(e) => { !props.disableAction && handleClick(e); }}
                sx={{
                    lineHeight: 1.4,
                    fontWeight: "700",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    alignItems: "center",
                    borderRadius: "0.5rem",
                    display: "inline-flex",
                    justifyContent: "center",
                    padding: "0.5rem 1rem",
                    color: props.color || "#ffffff",
                    border: `0.0625rem solid ${props.color || "#ffffff"}`,
                    background: `${props.background || "transparent"} !important`,
                }}
            >
                {props.isMiniSideNav ? null : <Language />}
                &ensp;{languageTitle}
            </Box>

            <Menu
                id="language_app"
                open={open}
                anchorEl={anchorEl}
                anchorReference={null}
                onClose={() => { !props.disableAction && handleClose(); }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Box sx={{ width: "120px" }}>
                    {
                        [...props.listMultiLanguage || []].map((item, index) => (
                            <MenuItem
                                key={`${item.code}_${index}`}
                                disabled={props.disableAction}
                                selected={props.language === `${item.code}`}
                                onClick={() => { !props.disableAction && handleLanguageChange(`${item.code}`); }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Typography variant="button">
                                        {props.isMiniSideNav
                                            ? languageTitles[`${item.code}`].miniTitle
                                            : languageTitles[`${item.code}`].title
                                        }
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))
                    }
                </Box>
            </Menu>
        </Box>
    );
};