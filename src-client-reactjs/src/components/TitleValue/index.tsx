import React from "react";
import Helpers from "../../commons/helpers";
import { Grid, Typography } from "@mui/material";

interface IProps {
    title?: string;
    value?: string | React.ReactNode;
    valueBold?: boolean;
    titleBold?: boolean;
    isFullRow?: boolean;
}

const TitleValue = ({ isFullRow, value, title, valueBold, titleBold }: IProps) => {
    const titleProps = { xs: 12, md: 6, lg: 6, xl: 4 }
    const valueProps = { xs: 12, md: 6, lg: 6, xl: 8 }

    if (!isFullRow && !Helpers.isNullOrEmpty(title) && !Helpers.isNullOrEmpty(value)) {
        return (
            <Grid container alignItems={"baseline"}>
                {
                    !Helpers.isNullOrEmpty(title) &&
                    <Grid size={titleProps}>
                        <Typography variant="button" fontSize={"0.85em"} fontWeight={titleBold ? "bold" : ""}>{title}:</Typography>
                    </Grid>
                }
                {
                    !Helpers.isNullOrEmpty(value) &&
                    <Grid size={valueProps}>
                        {
                            (Helpers.isNumber(value) || Helpers.isString(value))
                                ? (
                                    <Typography variant="button" fontSize={"0.85em"} fontWeight={valueBold ? "bold" : ""}>
                                        {`${value}`}
                                    </Typography>
                                )
                                : value
                        }
                    </Grid>
                }
            </Grid>
        )
    } else {
        return (
            <>
                {
                    !Helpers.isNullOrEmpty(title) &&
                    <Typography variant="button" fontSize={"0.85em"} fontWeight={titleBold ? "bold" : ""}>{title}:</Typography>
                }
                {
                    !Helpers.isNullOrEmpty(value) &&
                    <Typography variant="button" fontSize={"0.85em"} fontWeight={valueBold ? "bold" : ""}>{` ${value}`}</Typography>
                }
            </>
        );
    }
}

export default TitleValue;
