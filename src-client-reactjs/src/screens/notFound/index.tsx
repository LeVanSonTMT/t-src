import Strings from "constants/strings";
import Constants from "constants/constants";
import { DashboardLayout } from "layouts";

const NotFoundScreen = () => {
    return (
        <DashboardLayout isPermission title={""} route={[]}>
            <div style={{
                width: "100%",
                display: "flex",
                textAlign: "center",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingTop: "24px",
                paddingBottom: "24px",
                color: Constants.Colors.secondary.main,
            }}>
                <h2>{Strings.MESSAGE.PAGE_NOT_FOUND}</h2>
            </div>
        </DashboardLayout>
    );
};

export default NotFoundScreen;
