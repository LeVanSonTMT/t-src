import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    error?: string;
    logined?: boolean;
    logouted?: boolean;
    userInfo?: {
        id: string;
        roleCode: string;
        fullName: string;
        accountCode: string;
        needChangePW: number;
    };
}

const initialState: UserState = {
    error: undefined,
    logined: undefined,
    logouted: undefined,
    userInfo: undefined,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUserSuccess: (state, action: PayloadAction<any>) => {
            state.logined = true;
            state.logouted = false;
            state.error = undefined;
            state.userInfo = action.payload;
        },

        fetchUserFailed: (state, action: PayloadAction<string>) => {
            state.logined = false;
            state.error = action.payload;
        },

        fetchChangePassword: (state, action: PayloadAction<number>) => {
            state.userInfo = {
                ...state.userInfo,
                needChangePW: action.payload,
            };
        },

        resetUser: () => ({
            error: undefined,
            logined: undefined,
            logouted: true,
            userInfo: undefined,
        }),
    },
});

// Action creators are generated for each case reducer function
export const {
    resetUser,
    fetchUserFailed,
    fetchUserSuccess,
    fetchChangePassword,
} = userSlice.actions;

export default userSlice.reducer;
