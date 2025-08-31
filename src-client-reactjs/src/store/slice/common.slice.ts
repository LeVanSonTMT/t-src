import { ITitleRoute } from "commons/interfaces";
import { IDataAlert } from "components/CustomAlert";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CommonState {
    loading: boolean,
    routes?: ITitleRoute[];
    dataAlert?: IDataAlert;
    titleScreen?: string;
    targerScreen?: string;
    listPathName?: { pathName: string, query: string, totalCount: number }[];
}

const initialState: CommonState = {
    loading: false,
};

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        showLoading: (state) => {
            state.loading = true;
        },
        hiddenLoading: (state) => {
            state.loading = false;
        },

        setDataAlert: (state, action: PayloadAction<IDataAlert>) => {
            state.dataAlert = action.payload;
        },
        resetDataAlert: (state) => {
            state.dataAlert = undefined;
        },

        setTargerScreen: (state, action: PayloadAction<string>) => {
            state.targerScreen = action.payload;
        },
        updateTitleRoute: (state, action: PayloadAction<{
            routes?: ITitleRoute[];
            titleScreen?: string;
            targerScreen?: string;
        }>) => {
            state.routes = action.payload.routes;
            state.titleScreen = action.payload.titleScreen;
            state.targerScreen = action.payload.targerScreen;
        },
        setListPathName: (state, action: PayloadAction<{ pathname: string, query: string, totalCount?: number }>) => {
            let listTemp = [...state.listPathName || []];
            const index = listTemp.findIndex(el => el.pathName === action.payload.pathname);
            if (index === -1) {
                listTemp.push({
                    query: action.payload.query,
                    pathName: action.payload.pathname,
                    totalCount: action.payload.totalCount || 0,
                });
            } else {
                listTemp[index].query = action.payload.query;
                listTemp[index].totalCount = action.payload.totalCount || 0;
            }

            state.listPathName = listTemp;
        },
        resetTitleRoute: (state) => {
            state.routes = [];
            state.listPathName = [];
            state.titleScreen = "";
            state.targerScreen = "";
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    showLoading, hiddenLoading,
    setDataAlert, resetDataAlert,
    setListPathName, setTargerScreen,
    updateTitleRoute, resetTitleRoute,
} = commonSlice.actions

export default commonSlice.reducer