import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

import Helpers from "commons/helpers";
import Constants from "constants/constants";


interface IProps {
    noPad?: boolean;
    bgcolor?: string;
    noBorder?: boolean;
    borderColor?: string;
    width?: string | number;
    align?: "left" | "right" | "center";
    children: ReactNode;
}

const DataTableBodyCell = ({ width, noBorder, noPad, align, bgcolor, borderColor, children }: IProps): JSX.Element => {
    return (
        <Box
            component={"td"}
            textAlign={align || "left"}
            px={noPad ? 1 : 3}
            py={noPad ? 0.5 : 1.5}
            sx={{
                bgcolor: bgcolor,
                borderBottom: noBorder ? "none" : `1px solid ${borderColor || Constants.Colors.disable.main}`,
            }}
        >
            <Box
                display={"inline-block"}
                sx={{
                    minWidth: width,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    verticalAlign: "middle",
                    textOverflow: "ellipsis",
                    fontWeight: 600,
                    lineHeight: 1.25,
                    fontSize: "0.785rem",
                    letterSpacing: "0.03333em",
                    color: Constants.Colors.secondary.main,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DataTableBodyCell;
