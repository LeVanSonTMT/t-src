const Constants = {
    Api: {
        TIMEOUT: 60 * 1000,
    },

    /**
     * Return code from Api
     */
    ApiCode: {
        // Code from server api
        SUCCESS: 200,
        BAD_REQUEST: 400,
        TOKEN_EXPIRED: 401,
        NOT_PERMISSION: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },

    BrowserName: {
        EDGE: "Edge",
        OPERA: "Opera",
        CHROME: "Chrome",
        SAFARI: "Safari",
        FIREFOX: "Firefox",
        COC_COC: "COC_COC",
    },

    /**
     * Setting path for Api
     */
    ApiPath: {
        AUTH: {
            LOGIN: "/login",
            REFRESH_TOKEN: "refreshToken",
            CHANGE_PASSWOD: "/changePassword",
        },
    },

    /**
     * Regex Expression
     */
    RegExp: {
        DATE: new RegExp(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2})$/),
        ID_CARD: new RegExp(/^[0-9]{8,12}$/),
        HTML_TAGS: new RegExp(/<\/?[\w\s]*>|<.+[\W]>/),
        PHONE_NUMBER: new RegExp(/^0([135789]{1})([0-9]{8})$/),
        SPECIAL_CHARACTERS: new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/),
        // Bao gồm cả chữ hoa, chữ thường, số, ký tự đặc biệt và ít nhất 8 ký tự
        PASSWORD: new RegExp(/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/),
        EMAIL_ADDRESS: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        // Bao gồm Http(s) Protocol
        WEBSITE_ADDRESS_1: new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/),
        // Có hoặc không có Http(s) Protocol đều được
        WEBSITE_ADDRESS_2: new RegExp(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),
    },

    /**
     * Storage keys
     */
    StorageKeys: {
        FROM: "FROM",
        LANGUAGE: "LANGUAGE",
        AUTH_INFO: "AUTH_INFO",
    },

    EventName: {
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
        NOT_PERMISSION: "NOT_PERMISSION",
        LANGUAGE_CHANGE: "LANGUAGE_CHANGE",
    },

    /**
     * Cookie keys
     */
    CookieNames: {
        LANGUAGE: "lang",
        SESSION_ID: "sessionId",
    },

    DefaultLanguage: "vi",
    LanguageContent: {
        VI: "vi",
        EN: "en",
    },

    /**
     * Row per paged
     */
    PAGE_DEFAULT: 1,
    ROW_PER_PAGE: 10,
    ROW_PER_PAGE_OPTIONS: [10, 20, 50],

    /**
     * format datetime
     */
    DateFormat: {
        DDMM: "DD/MM",
        MMYYYY: "MM/YYYY",
        DDMMYYYY: "DD/MM/YYYY",
        DDMMYYYY_HHMM: "DD/MM/YYYY HH:mm",
        DDMMYYYY_HHMMSS: "DD/MM/YYYY HH:mm:ss",
        HHMM_DDMMYYYY: "HH:mm DD/MM/YYYY",
        HHMM: "HH:mm",
        YYYY: "YYYY",
        YYYYMM: "YYYY/MM",
        YYYYMMDD: "YYYY/MM/DD",
        YYYYMMDD_HHMM: "YYYY/MM/DD HH:mm",
        DDDD: "dddd",
    },

    MomentWeekDay: {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    },

    Colors: {
        text: {
            main: "#7b809a",
            focus: "#7b809a",
        },

        transparent: "transparent",

        primary: {
            main: "#1976d2",
            focus: "#368ce0",
        },

        secondary: {
            main: "#7b809a",
            focus: "#8f93a9",
        },

        info: {
            main: "#0288d1",
            focus: "#0288d1",
        },

        success: {
            main: "#2e7d32",
            focus: "#2e7d32",
        },

        warning: {
            main: "#ed6c02",
            focus: "#facea8",
        },

        error: {
            main: "#d32f2f",
            focus: "#f44335",
        },

        light: {
            main: "#f0f2f5",
            focus: "#f0f2f5",
        },

        dark: {
            main: "#344767",
            focus: "#2c3c58",
        },

        disable: {
            main: "#d2d6da",
            focus: "#d2d6da",
        },

        f3: "#f3f3f3",
        btn_back: "#888",
    },

    BreakPoints: {
        xs: [0, 600], // extra-small: 0px
        sm: [600, 900], // small: 600px
        md: [900, 1200], // medium: 900px
        lg: [1200, 1536], // large: 1200px
        xl: [1536], // extra-large: 1536px
    },

};

export default Constants;
