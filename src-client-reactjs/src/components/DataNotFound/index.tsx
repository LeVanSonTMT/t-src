import { Box, Typography } from "@mui/material";

import Strings from "constants/strings";
import Resources from "commons/resources";
import Constants from "constants/constants";



const DataNotFound = ({ text, height, borderRadius }: { text?: string, height?: any, borderRadius?: any }) => {
    return (
        <Box
            sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                height: height || "40vh",
                borderRadius: borderRadius || "none",
                backgroundColor: Constants.Colors.f3,
                width: "100%",
                "img": {
                    height: "60%",
                    borderRadius: "50%",
                }
            }}
        >
            <img alt="no_data" src={Resources.Images.NO_DATA} />
            <Typography variant="caption" fontWeight="bold" color="textSecondary">
                {text || Strings.COMMON.NO_DATA}
            </Typography>
        </Box>
    );
};

export default DataNotFound;
