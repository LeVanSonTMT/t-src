// @mui material components
import { Theme } from "@mui/material/styles";
import Constants from "constants/constants";

function menuItem(theme: Theme) {
    const { transitions } = theme;

    return {
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: "8px",
        marginBottom: "0px",
        color: Constants.Colors.secondary.main,
        transition: transitions.create("background-color", {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
        }),

        "& *": {
            transition: "color 100ms linear",
        },

        // "&:not(:last-child)": {
        //     mb: 1,
        // },

        "&:hover": {
            backgroundColor: "#ffffff",
            "& *": {
                opacity: 0.6,
            },
        },
    };
}

export default menuItem;
