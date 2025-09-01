import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Grid } from "@mui/material";

import Helpers from "commons/helpers";
import Screens from "constants/screens";
import Strings from "constants/strings";
import Loading from "components/Loading";
import Resources from "commons/resources";
import Constants from "constants/constants";
import CustomTextField from "components/CustomTextField";

import { fetchUserSuccess } from "store/slice/user.slice";



const LoginScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<{ value?: string, error?: string }>({});
    const [password, setPassword] = useState<{ value?: string, error?: string }>({});

    useEffect(() => {
    }, []);

    const handleValidate = () => {
        let check = true;
        if (Helpers.isNullOrEmpty(username?.value)) {
            check = false;
            setUsername({ error: Strings.LOGIN.PLASE_ENTER_USER_NAME });
        }
        if (Helpers.isNullOrEmpty(password?.value)) {
            check = false;
            setPassword({ error: Strings.LOGIN.PLASE_ENTER_PASSWORD });
        }
        return check;
    };

    const handleSign = async () => {
        if (!handleValidate()) {
            return;
        } else {
            try {
                setLoading(true);

                const result: any = {
                    "userInfo": {
                        "id": "0000000000000000000A",
                        "fullName": "Quản trị viên",
                        "roleCode": "000001",
                        "password": "$2b$10$hu1h9.wb7pUWvMc6jjuo..GUTq.Nhg.Me8h1Ukq/gsMmQXYCE7eei",
                        "accountCode": "admin",
                        "needChangePW": null,
                        "searchtext": "adminquantrivien",
                        "status": 1,
                        "createTime": null,
                        "createUser": null,
                        "updateTime": null,
                        "updateUser": null
                    },
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlF14bqjbiB0cuG7iyB2acOqbiIsInJvbGVDb2RlIjoiMDAwMDAxIiwiYWNjb3VudElkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMEEiLCJhY2NvdW50Q29kZSI6ImFkbWluIiwiaWF0IjoxNzU1MDY5NzM3LCJleHAiOjE3NTUxNTYxMzd9._JhRlN68O-WisOcC4Ed3OeH_ctfoXZmw_HNx0jov4kc",
                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IlF14bqjbiB0cuG7iyB2acOqbiIsInJvbGVDb2RlIjoiMDAwMDAxIiwiYWNjb3VudElkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMEEiLCJhY2NvdW50Q29kZSI6ImFkbWluIiwiaWF0IjoxNzU1MDY5NzM3LCJleHAiOjE3NTUxNTYxMzd9.myWnrGVSgl2wPkAxtHxa4ASi-6_yxj-EXDdcH650gM4"
                };

                Helpers.setItemInLocalStorage(Constants.StorageKeys.AUTH_INFO, result);

                dispatch(fetchUserSuccess({ ...result?.userInfo }));

                if (!Helpers.isNullOrEmpty(result?.accessToken)) {
                    axios.defaults.headers["Authorization"] = `Bearer ${result?.accessToken}`;
                };

                navigate(Screens.LOGIN_REDIRECT);
            } catch (error: any) {
                error?.message && Helpers.showAlert({ type: "error", message: error?.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            overflow: "auto",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
        }}>
            <Loading visible={loading} />
            <Card sx={{
                margin: 3,
                boxShadow: 2,
                borderRadius: "8px",
            }}>
                <Box sx={{ display: "flex", height: "550px", }}>
                    <Box sx={{
                        p: 0, m: 0,
                        display: { xs: "none", md: "block" },
                        bgcolor: Constants.Colors.primary.main,
                        "#bg_login": {
                            width: { xs: "auto", sm: "auto", md: "550px", lg: "650px" },
                            height: "100%",
                            objectFit: "cover",
                        }
                    }}>
                        <img
                            id="bg_login"
                            alt="bg_login"
                            src={Resources.Images.BG_LOGIN}
                        />
                    </Box>
                    <Box
                        padding={{ xs: "16px", sm: "24px", md: "32px" }}
                        maxWidth={{ xs: "auto", sm: "400px", md: "400px" }}
                    >
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <img
                                        alt="bg_login"
                                        src={Resources.Images.LOGO}
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <CustomTextField
                                    maxLength={20}
                                    value={username?.value}
                                    errorMessage={username?.error}
                                    label={Strings.LOGIN.USER_NAME}
                                    placeholder={Strings.LOGIN.ENTER_USER_NAME}
                                    onChangeValue={(value) => { setUsername({ value: value }) }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <CustomTextField
                                    maxLength={255}
                                    type={"password"}
                                    value={password?.value}
                                    label={Strings.LOGIN.PASSWORD}
                                    errorMessage={password?.error}
                                    placeholder={Strings.LOGIN.ENTER_PASSWORD}
                                    onChangeValue={(value) => { setPassword({ value: value }) }}
                                    onKeyDown={(e: any) => {
                                        if (e.key === "Enter" && e.target.value) {
                                            handleSign();
                                        };
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Button
                                    fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    onClick={() => { handleSign(); }}
                                >
                                    {Strings.LOGIN.LOGIN}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default LoginScreen;
