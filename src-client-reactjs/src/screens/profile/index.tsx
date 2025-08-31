import Strings from "constants/strings";
import { DashboardLayout } from "layouts";



const ProfileScreen = () => {

    return (
        <DashboardLayout
            isPermission
            title={Strings.PROFILE.PROFILE_INFO}
            route={[{ title: Strings.PROFILE.PROFILE_INFO, route: "" }]}
        >
            <>{"Profile Screen"}</>
        </DashboardLayout>
    );
};

export default ProfileScreen;
