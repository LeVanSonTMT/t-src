import { Theme } from "@mui/material/styles";

const pdf_toolbar = (theme: Theme | any) => {
    return {
        top: 0,
        zIndex: 9,
        position: "sticky",
        gap: { xs: "4px", md: "16px", },
        width: "100%",
        color: "#fff",
        display: "flex",
        padding: { xs: "6px 12px", sm: "10px 20px", },
        flexWrap: "wrap",
        alignItems: "center",
        backgroundColor: "#3c3c3c",
        justifyContent: "space-between",
    };
};

const pdf_toolbar_title = (theme: Theme | any) => {
    return {
        gap: { xs: "0px", sm: "4px" },
        display: "flex",
        overflow: "hidden",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        alignItems: "center",
        textOverflow: "ellipsis",
        width: { xs: "100%", sm: "100%", md: "calc(100% - 438px - 16px)" },
    };
};

const input_show = (theme: Theme | any) => {
    return {
        width: "80px",
        padding: "2px 8px",
        textAlign: "center",
        backgroundColor: "#000000",
    };
};

const gach_phan_cach = (theme: Theme | any) => {
    return {
        display: { xs: "none", sm: "flex" },
        visibility: { xs: "hidden", sm: "visible" },
    };
};

const pdf_toolbar_action = (theme: Theme | any) => {
    return {
        gap: { xs: "8px", sm: "8px", md: "16px" },
        width: { xs: "100%", md: "438px" },
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
    };
};

const actionBtn = (theme: Theme | any, ownerState: any) => {
    const { disabled = false, circle = false } = ownerState;

    return {
        color: "#fff",
        width: "28px",
        height: "28px",
        margin: "0px",
        padding: "0px",
        border: "none",
        display: "flex",
        alignItems: "center",
        borderRadius: "4px",
        justifyContent: "center",
        backgroundColor: "#555555",
        ".MuiSvgIcon-root": {
            width: "0.75em",
            height: "0.75em",
        },
        ...(circle && {
            borderRadius: "14px",
        }),
        ...(!disabled && {
            cursor: "pointer",
            ":hover": {
                backgroundColor: "#777777",
            },
        }),
    };
};

const pdf_sidebar = (theme: Theme | any) => {
    return {
        zIndex: 8,
        position: "absolute",

        width: "120px",
        height: "1200px",
        padding: "10px 4px",
        overflowY: "auto",
        scrollbarWidth: "none",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        visibility: { xs: "hidden", sm: "visible" },
    };
};

const pdf_sidebar_thumbnail = (theme: Theme | any, ownerState: any) => {
    const { actived = false } = ownerState;
    return {
        mb: "4px",
        cursor: "pointer",
        border: "4px solid transparent",
        ...(actived && {
            borderColor: "#4285f4",
            backgroundColor: "#2c2c2c",
        })
    };
};

const pdf_viewer = (theme: Theme | any) => {
    return {
        width: "100%",
        height: "1200px",
        display: "flex",
        position: "absolute",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#000000",
    };
};

const pdf_viewer_thumbnail = (theme: Theme | any) => {
    return {
        gap: "8px",
        width: "100%",
        display: "grid",
        overflow: "auto",
        scrollbarWidth: "none",
        justifyContent: "center",
        border: "3px solid #000000",
    };
};


export {
    actionBtn,
    pdf_toolbar,
    pdf_toolbar_title,
    pdf_toolbar_action,

    input_show,
    gach_phan_cach,

    pdf_sidebar,
    pdf_sidebar_thumbnail,

    pdf_viewer,
    pdf_viewer_thumbnail,
}