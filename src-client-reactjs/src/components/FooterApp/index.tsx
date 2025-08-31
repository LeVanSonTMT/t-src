import { Box, Typography } from "@mui/material";

import Screens from "constants/screens";
import Strings from "constants/strings";
import Constants from "constants/constants";



const FooterApp = () => {

    const pathNameCurrent = window.location?.pathname;

    return (
        <Box sx={{
            gap: "8px",
            width: "100%",
            padding: "16px",
            alignItems: "end",
            justifyContent: "space-between",
            display: { xs: "grid", sm: "grid", md: "flex" },
        }}>
            <Box sx={{
                gap: "4px",
                width: "100%",
                display: "grid",
            }}>
                <Typography variant="button" sx={{ fontSize: "1.1rem" }}>
                    {Strings.APP.COMPANY_NAME}
                </Typography>
                <Typography variant="button">
                    {Strings.APP.COMPANY_ADDRESS}
                </Typography>
                <Typography variant="button">
                    {
                        Strings.formatString(
                            Strings.APP.COMPANY_CONTACT,
                            Strings.APP.COMPANY_PHONE_NUMBER,
                            Strings.APP.COMPANY_EMAIL
                        )
                    }
                </Typography>
            </Box>

            <Box sx={{
                gap: "4px",
                width: "100%",
                display: "grid",
            }}>
                <Typography variant="button" sx={{ textAlign: "center", fontSize: "0.925rem" }}>
                    {"Copyright © 2025 Stapimex | Đã đăng ký Bản quyền."}
                </Typography>
                <Box sx={{
                    gap: { xs: "16px", md: "24px" },
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Box
                        sx={text_link}
                        component={"div"}
                        onClick={() => {
                            // const target = pathNameCurrent === Screens.INTRODUCTIONS ? "_self" : "_blank";
                            // window.open(Screens.INTRODUCTIONS, target);
                        }}
                    >
                        <Typography variant="button">
                            {Strings.APP.INTRODUCTIONS}
                        </Typography>
                    </Box>
                    <Box
                        sx={text_link}
                        component={"div"}
                        onClick={() => {
                            // const target = pathNameCurrent === Screens.PRIVACY_POLICY ? "_self" : "_blank";
                            // window.open(Screens.PRIVACY_POLICY, target);
                        }}
                    >
                        <Typography variant="button">
                            {Strings.APP.PRIVACY_POLICY}
                        </Typography>
                    </Box>
                    <Box
                        sx={text_link}
                        component={"div"}
                        onClick={() => {
                            // const target = pathNameCurrent === Screens.TERMS_OF_USE ? "_self" : "_blank";
                            // window.open(Screens.TERMS_OF_USE, target);
                        }}
                    >
                        <Typography variant="button">
                            {Strings.APP.TERMS_OF_USE}
                        </Typography>
                    </Box>
                    <Box
                        sx={text_link}
                        component={"div"}
                        onClick={() => {
                            // const target = pathNameCurrent === Screens.INSTRUCTIONS ? "_self" : "_blank";
                            // window.open(Screens.INSTRUCTIONS, target);
                        }}
                    >
                        <Typography variant="button">
                            {Strings.APP.INSTRUCTIONS}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FooterApp;


const text_link = () => {
    return {
        "& .MuiTypography-root": {
            textDecoration: "underline",
        },
        "&:hover": {
            cursor: "pointer",
            "& .MuiTypography-root": {
                fontWeight: 400,
                color: Constants.Colors.info.main,
            }
        }
    };
};