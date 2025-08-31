import Helpers from "commons/helpers";
import Constants from "constants/constants";
import { Theme } from "@mui/material/styles";

const navbar = (theme: Theme | any, ownerState: any): any => {
    const { transitions, breakpoints } = theme;
    const { transparentNavbar } = ownerState;

    const navbarBoxShadow = "none";

    return {
        boxShadow: transparentNavbar ? "none" : navbarBoxShadow,
        backdropFilter: transparentNavbar ? "none" : `saturate(200%) blur(${Helpers.pxToRem(30)})`,
        backgroundColor:
            transparentNavbar
                ? "transparent !important"
                : Helpers.rgba("#ffffff", 0.8),

        color: Constants.Colors.dark.main,
        top: Helpers.pxToRem(12),
        display: "grid",
        alignItems: "center",
        borderRadius: "8px",
        width: "auto",
        padding: "8px",
        minHeight: Helpers.pxToRem(75),
        "& > *": {
            transition: transitions.create("all", {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.standard,
            }),
        },

        "& .MuiToolbar-root": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            [breakpoints.up("sm")]: {
                minHeight: "auto",
                padding: `${Helpers.pxToRem(4)} ${Helpers.pxToRem(16)}`,
            },
        },
    };
};

const navbarContainer = (them: Theme): any => ({
    width: "100%",
    padding: "0px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

const styleIconButton = ({ breakpoints }: Theme) => ({
    pr: 1, pl: 1,

    "& .material-icons, .material-icons-round": {
        fontSize: `40px !important`,
    },

    "& .MuiTypography-root": {
        display: "none",

        [breakpoints.up("sm")]: {
            display: "inline-block",
            lineHeight: 1.2,
            ml: 0.5,
        },
    },
});

const styleBoxPopper = (theme: any) => {
    return {
        [theme.breakpoints.down("sm")]: {
            [theme.breakpoints.down(325)]: {
                width: "200px !important",
            },
            [theme.breakpoints.up(325)]: {
                width: "250px !important",
            },
        },
        [theme.breakpoints.up("sm")]: {
            width: "300px !important",
        },
    }
};


const navLink = (theme: Theme | any, ownerState: { isActive: boolean; isMobile: boolean }): any => {
    const { isActive, isMobile } = ownerState;

    const mobileStyles = () => ({
        borderRadius: 2,
        padding: "4px 12px",
        "&:hover": {
            cursor: "pointer",
            color: Constants.Colors.primary.main,
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.1),
        },
        "&:focus": {
            color: Constants.Colors.primary.main,
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.3),
        },
        ...(isActive && {
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.3),
        }),

        ".MuiTypography-root": {
            color: isActive ? Constants.Colors.primary.main : Constants.Colors.dark.main,
            fontWeight: isActive ? 600 : 600,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textDecoration: "none",
            textOverflow: "ellipsis",
            letterSpacing: "0.03em",
        },
    });

    const desktopStyles = () => ({
        p: "4px 12px",
        display: "flex",
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center",

        "&:hover": {
            color: Constants.Colors.primary.main,
            cursor: "pointer",
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.1),
        },
        "&:focus": {
            color: Constants.Colors.primary.main,
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.3),
        },

        ...(isActive && {
            backgroundColor: Helpers.rgba(Constants.Colors.primary.main, 0.3),
        }),

        ".MuiTypography-root": {
            color: isActive ? Constants.Colors.primary.main : Constants.Colors.dark.main,
            fontWeight: isActive ? 600 : 500,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textDecoration: "none",
            textOverflow: "ellipsis",
            letterSpacing: "0.03em",
        },
    });

    return {
        ...(isMobile && mobileStyles()),
        ...(!isMobile && desktopStyles()),
    };
};

export {
    navbar,
    navLink,
    styleBoxPopper,
    styleIconButton,
    navbarContainer,
};
