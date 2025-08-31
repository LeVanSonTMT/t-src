import { createTheme } from "@mui/material";

import globals from "./globals";
import formControlLabel from "./formControlLabel";


export default createTheme({
    components: {
        MuiFormControlLabel: { ...formControlLabel },
        MuiCssBaseline: {
            styleOverrides: {
                ...globals,
            },
        },
    }
});