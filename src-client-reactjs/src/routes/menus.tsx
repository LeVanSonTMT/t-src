import { useEffect, useState } from "react";

import Screens from "constants/screens";
import Strings from "constants/strings";

import ProfileScreen from "screens/profile";
import DashboardScreen from "screens/dashboard";

import { IMenuItem } from "commons/interfaces";



export const useRenderMenus = (key: any) => {
    const [menus, setMenus] = useState<IMenuItem[]>([]);

    useEffect(() => {
        const arrMenu: IMenuItem[] = [
            // Dashboard
            {
                key: "dashboard",
                isVisible: false,
                title: Strings.COMMON.HOME,
                screenPath: Screens.HOME,
                screenName: <DashboardScreen />,
            },

            // Profile
            {
                key: "profile",
                isVisible: false,
                screenPath: Screens.PROFILE,
                screenName: <ProfileScreen />,
                title: Strings.PROFILE.PROFILE_INFO,
            },
        ];

        setMenus(arrMenu);
    }, [key]);

    return menus;
}