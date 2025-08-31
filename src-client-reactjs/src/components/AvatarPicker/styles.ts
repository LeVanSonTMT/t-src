import { Theme } from "@mui/material/styles";

const avatarBox = () => {
    return {
        position: "relative",
        "&:hover .MuiSvgIcon-root": {
            cursor: "pointer",
            display: "inline-block",
        },
        "&:hover #hoverBox": {
            cursor: "pointer",
            display: "flex",
        }
    }
};

const camera = (theme: Theme | any, ownerState: any) => {
    const { size } = ownerState;
    return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        display: "none",
        color: "#ffffff",
        position: "absolute",
        width: size,
        height: size,
    }
};

const hoverBox = (theme: Theme | any, ownerState: any) => {
    const { size } = ownerState;
    return {
        margin: "auto",
        display: "none",
        borderRadius: "50%",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        width: size,
        height: size,
    }
};

export {
    camera,
    hoverBox,
    avatarBox,
}