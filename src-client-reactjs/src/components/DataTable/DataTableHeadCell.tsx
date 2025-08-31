import { ReactNode } from "react";
import { Box } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

import Helpers from "commons/helpers";
import Constants from "constants/constants";

interface Props {
    children: ReactNode;
    w?: string | number;
    width?: string | number;
    sorted?: "asce" | "desc";
    align?: "left" | "right" | "center";
    noPad?: boolean;
    center?: boolean;
    bgColor?: string;
    borderColor?: string;
}

const DataTableHeadCell = ({ w, width, children, sorted, align, noPad, center, bgColor, borderColor, ...rest }: Props): JSX.Element => {
    return (
        <Box
            width={w}
            component={"th"}
            px={noPad ? 0 : 3}
            py={noPad ? 0.5 : 1.5}
            sx={{
                borderBottom: `1px solid ${borderColor || Constants.Colors.disable.main}`,
                backgroundColor: bgColor || "#e5e7eb",
                ...(center && {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }),
            }}
        >
            <Box
                {...rest}
                width={width}
                color={"secondary"}
                position={"relative"}
                textAlign={align || "left"}
                sx={(theme) => ({
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    cursor: sorted && "pointer",
                    userSelect: sorted && "none",
                    fontSize: Helpers.pxToRem(10.4),
                })}
            >
                {children}
                {sorted && (
                    <Box
                        top={0}
                        position={"absolute"}
                        right={(align !== "right") ? "16px" : 0}
                        left={(align === "right") ? "-5px" : "unset"}
                    >
                        <Box position="absolute" top={-6} color={(sorted === "asce") ? "black" : "gray"}>
                            <ArrowDropUp />
                        </Box>
                        <Box position="absolute" top={0} color={(sorted === "desc") ? "black" : "gray"}>
                            <ArrowDropDown />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DataTableHeadCell;
