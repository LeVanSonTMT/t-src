import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Helpers from "commons/helpers";
import Screens from "constants/screens";
import Constants from "constants/constants";

import { RootState } from "store";
import { LoadingLayout } from "layouts";



const LoginRedirectScreen = () => {

    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user?.logined) {
            const from = Helpers.getItemInLocalStorage(Constants.StorageKeys.FROM) || Screens.HOME;
            if ([Screens.LOGIN, Screens.LOGIN_REDIRECT].includes(from)) {
                navigate(Screens.HOME);
            } else {
                navigate(from);
            }
        } else {
            navigate(Screens.LOGIN);
        };

    }, [user?.logined]);

    return <LoadingLayout />;
};

export default LoginRedirectScreen;
