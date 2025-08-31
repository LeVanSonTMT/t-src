import Helpers from "commons/helpers";
import Constants from "constants/constants";
import { Theme } from "@mui/material/styles";

function gridMenuBarStyle(theme: Theme, ownerState: { backgroundColor?: string, borderRadius?: any }) {
    return {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: ownerState.borderRadius || "unset",
        backgroundColor: ownerState.backgroundColor || "transparent",
    };
}

function listItemMenuStyle(
    theme: Theme,
    ownerState: {
        isParent: boolean,
        openMenu: boolean,
        isActive: boolean,

        hoverColor?: string,
        bgColorItem?: string,
        hoverBgColor?: string,
        bgColorSubItem?: string,
    },
) {
    const {
        hoverBgColor, hoverColor,
        bgColorItem, bgColorSubItem,
        isActive, isParent, openMenu,
    } = ownerState;

    const parentStyles = () => ({
        display: "flex",
        justifyContent: openMenu ? "space-between" : "center",
    });

    const childStyles = () => ({
        justifyContent: openMenu ? "flex-start" : "center",
        backgroundColor: isActive ? (bgColorSubItem || Helpers.rgba(Constants.Colors.primary.main, 0.8)) : "transparent",
    });

    return {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        alignItems: "center",
        borderRadius: "8px",
        transition: "all 300ms linear",
        backgroundColor: isActive ? (bgColorItem || "#757575") : "transparent",
        padding: `${Helpers.pxToRem(openMenu ? 8 : 4)} ${Helpers.pxToRem(openMenu ? 16 : 2)}`,
        "&:hover": {
            color: hoverColor || "#000000",
            backgroundColor: hoverBgColor || "#bdbdbd",
            "& .MuiTypography-root": {
                color: hoverColor || "#000000",
            },
            "& .icon_menu_sl": {
                color: hoverColor || "#000000",
            },
        },
        ...(isParent ? parentStyles() : childStyles())
    }
}

function iconItemMenuStyle(
    theme: Theme,
    ownerState: {
        color?: string,
        isActive: boolean,
        hoverColor?: string,
        colorActive?: string,
    },
) {
    const { color, isActive, hoverColor, colorActive } = ownerState;

    return {
        width: "24px",
        height: "24px",
        display: "grid",
        marginRight: "8px",
        placeItems: "center",
        color: isActive ? (colorActive || "#fff") : (color || "#fff"),
        "&:hover": {
            color: hoverColor || "#fff",
        },
    }
}

function textItemMenuStyle(
    theme: Theme,
    ownerState: {
        color?: string,
        isActive: boolean,
        hoverColor?: string,
        colorActive?: string,
    },
) {
    const { color, isActive, hoverColor, colorActive } = ownerState;

    return {
        fontWeight: isActive ? 600 : 400,
        color: isActive ? (colorActive || "#fff") : (color || "#fff"),
        "&:hover": {
            color: hoverColor || "#fff",
        },
    }
}

export {
    gridMenuBarStyle,
    listItemMenuStyle,
    iconItemMenuStyle,
    textItemMenuStyle,
}