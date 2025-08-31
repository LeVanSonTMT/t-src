import MenuItem from "@mui/material/MenuItem";
import { forwardRef, ReactNode } from "react";
import { Box, Typography } from "@mui/material";

import menuItem from "./styles";
import Helpers from "commons/helpers";
import { ColorText } from "commons/interfaces";

interface IProps {
    icon?: ReactNode;
    title: string | ReactNode;
    maxWidth?: any;
    disabled?: boolean;
    colorText?: ColorText;
    onClick?: () => void;
}

const CustomMenuItem = forwardRef<HTMLLIElement, IProps>(({ icon, title, colorText, maxWidth, ...rest }, ref) => (
    <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
        <Box sx={{
            p: 0,
            gap: 1,
            display: "flex",
            alignItems: "center",

        }}>
            {icon && icon}
            {Helpers.isString(title)
                ? (
                    <Typography
                        variant={"button"}
                        fontWeight={"regular"}
                        lineHeight={1.5}
                        color={colorText || "textSecondary"}
                        sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: maxWidth,
                        }}>
                        {title}
                    </Typography>
                )
                : (
                    <Box sx={{ maxWidth: maxWidth }}>{title}</Box>
                )
            }

        </Box>
    </MenuItem>
));

export default CustomMenuItem;
