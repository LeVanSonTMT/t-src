type Types = any;

const formControlLabel: Types = {
    styleOverrides: {
        root: {
            display: "block",
            minHeight: "1.5rem",
            marginBottom: "0.125rem",
        },

        label: {
            display: "inline-block",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: 1,
            color: "#000000",
            transform: "translateY(0.063rem)",
            marginLeft: "0.25rem",

            "&.Mui-disabled": {
                color: "#000000",
            },
        },
    },
};

export default formControlLabel;
