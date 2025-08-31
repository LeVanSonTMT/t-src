import React from "react";
import EventEmitter from "events";
import ReactDOM from "react-dom/client";

import "moment/locale/vi";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

import App from "./App";
import theme from "./assets/theme";
import reportWebVitals from "./reportWebVitals";

import { store } from "store";
import { MaterialUIControllerProvider } from "./components/context";


const mw = window as any;
mw.__EventEmitter = new EventEmitter();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<MaterialUIControllerProvider>
					<CssBaseline />
					<App />
				</MaterialUIControllerProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	</Provider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
