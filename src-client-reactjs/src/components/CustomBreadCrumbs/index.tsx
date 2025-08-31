import { Home } from "@mui/icons-material";
import { Breadcrumbs as MuiBreadcrumbs, IconButton, Box, Typography } from "@mui/material";

import Helpers from "../../commons/helpers";
import { ITitleRoute } from "commons/interfaces";

interface IProps {
    title: string;
    routes?: ITitleRoute[];
    pathHome: string;
    onNavigate: (pathName: string) => void;
    // [key: string]: any;
};

const CustomBreadCrumbs = ({ title, routes, pathHome, onNavigate }: IProps) => {

    return (
        <Box mr={{ xs: 0, xl: 0 }}>
            <MuiBreadcrumbs>
                <IconButton sx={{ p: 0 }} onClick={() => { onNavigate(pathHome) }}>
                    <Typography
                        variant="body2"
                        sx={{ lineHeight: "0px !important" }}
                    >
                        <Home />
                    </Typography>
                </IconButton>
                {([...routes || []].length > 0)
                    && [...routes || []].map((el, index) => (
                        <Box
                            key={index}
                            component={"div"}
                            onClick={() => {
                                if (!Helpers.isNullOrEmpty(el.route)) {
                                    onNavigate(el.route);
                                };
                            }}
                            sx={{
                                ...(!Helpers.isNullOrEmpty(el.route) && {
                                    ":hover": {
                                        cursor: "pointer",
                                        "& .MuiTypography-root": {
                                            color: "#000",
                                            textDecoration: "underline",
                                        },
                                    },
                                })
                            }}
                        >
                            <Typography
                                color="textSecondary"
                                variant="button"
                                fontWeight="regular"
                                textTransform="none"
                                sx={{ lineHeight: 0 }}
                            >
                                {el.title}
                            </Typography>
                        </Box>
                    ))
                }
            </MuiBreadcrumbs>
            <Typography
                noWrap
                key={title}
                variant="h6"
                fontWeight="bold"
                textTransform="none"
                sx={{ paddingLeft: "4px" }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default CustomBreadCrumbs;
