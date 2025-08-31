import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import Helpers from "commons/helpers";
import Screens from "constants/screens";
import Constants from "constants/constants";

import { RootState } from "store";

interface IProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProps> = (props: IProps) => {
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);

    if (!Helpers.isNullOrEmpty(user?.error)) {
        Helpers.showAlert({
            type: "error",
            message: user?.error,
            okCallback: () => { },
        });
    };

    if (!user?.logouted) {
        Helpers.setItemInLocalStorage(Constants.StorageKeys.FROM, `${location.pathname}${location.search}`);
    };

    if (Helpers.isNullOrEmpty(user?.userInfo?.id)) {
        return <Navigate to={Screens.LOGIN_REDIRECT} replace />
    } else {
        return props.children;
    };

};

export default ProtectedRoute;
