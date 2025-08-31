import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Screens from "constants/screens";
import Constants from "constants/constants";

import LoginScreen from "screens/login";
import NotFoundScreen from "screens/notFound";
import DashboardScreen from "screens/dashboard";
import ProtectedRoute from "routes/protectedRoute";
import LoginRedirectScreen from "screens/login/loginRedirect";

import { RootState } from "store";
import { MainLayout } from "layouts";
import { useRenderMenus } from "routes/menus";
import { fetchUserSuccess, resetUser } from "store/slice/user.slice";

import "./App.css";

function App() {

	const dispatch = useDispatch();
	const [renderKey, setRenderKey] = useState(0);

	const menus = useRenderMenus(0);

	const user = useSelector((state: RootState) => state.user);

	useEffect(() => {
		const handleEventTokenExpired = () => {
			Helpers.showAlert({
				type: "error",
				message: Strings.MESSAGE.TOKEN_EXPIRED,
				okCallback() {
					sessionStorage.clear();

					localStorage.clear();

					dispatch(resetUser());
				},
			});
		};

		__EventEmitter.addListener(Constants.EventName.TOKEN_EXPIRED, handleEventTokenExpired);

		__EventEmitter.addListener(Constants.EventName.LANGUAGE_CHANGE, () => { setRenderKey(Date.now()) });

		return () => {
			__EventEmitter.removeListener(Constants.EventName.TOKEN_EXPIRED, handleEventTokenExpired);

			__EventEmitter.removeListener(Constants.EventName.LANGUAGE_CHANGE, () => { setRenderKey(Date.now()) });
		}
	}, []);

	useEffect(() => {
		const authInfo = Helpers.getItemInLocalStorage(Constants.StorageKeys.AUTH_INFO, {});
		if (Helpers.isNullOrEmpty(user?.userInfo?.id) && !Helpers.isNullOrEmpty(authInfo?.userInfo?.id)) {
			dispatch(fetchUserSuccess(authInfo?.userInfo));
		};

		if (!Helpers.isNullOrEmpty(authInfo?.accessToken)) {
			axios.defaults.headers["Authorization"] = `Bearer ${authInfo?.accessToken}`;
		};

	}, [user?.userInfo?.id]);

	const renderRoutes = useMemo(() => {
		const arrRoutes: any[] = [];

		const permission = [].includes(user?.userInfo?.roleCode as any);

		menus.forEach((item, key) => {
			if (item.subMenu?.length > 0) {
				item.subMenu.forEach((el, index) => {
					if (permission || Helpers.isNullOrEmpty(el.resourceCode)) {
						arrRoutes.push(
							<Route
								path={el.screenPath}
								key={`${key}+${index}}`}
								element={el.screenName ?? <></>}
							/>
						);
					};
				});
			} else {
				if (permission || Helpers.isNullOrEmpty(item.resourceCode)) {
					arrRoutes.push(
						<Route
							key={key}
							path={item.screenPath}
							element={item.screenName ?? <></>}
						/>
					);
				};
			}
		});
		return arrRoutes;
	}, [menus, user?.userInfo?.roleCode]);

	return (
		<BrowserRouter key={renderKey}>
			<Routes>
				<Route path={Screens.LOGIN} element={<LoginScreen />} />
				<Route path={Screens.LOGIN_REDIRECT} element={<LoginRedirectScreen />} />
				<Route path={Screens.HOME} element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
					<Route index element={<DashboardScreen />} />
					{renderRoutes}
					<Route path="*" element={<NotFoundScreen />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
