export interface ITitleRoute {
    title: string;
    route: string;
}

export interface ICodename<T = any> {
    name: string;
    code: string | number;
    detail?: T;
}

export interface IMultiLanguageContent {
    value: any;
    code?: string | undefined;
    error?: string | undefined;

}
export interface IGetPaged<T = any> {
    pageSize: number;
    currentPage: number;

    totalCount: number;
    totalPages: number;

    hasNext: boolean;
    hasPrevious: boolean;

    items: T[];
    selectedItems?: T[];
}

export interface IMenuItem {
    key: string;
    title: string;
    isVisible?: boolean;

    iconName?: string;
    icon?: JSX.Element;
    hiddenIcon?: boolean;

    screenPath?: string; // primary and only
    screenName?: JSX.Element;

    subMenu?: IMenuItem[];
    resourceCode?: string | string[];
    target?: "_self" | "_blank" | "_parent" | "_top";
    callback?: () => void;

    isHideNavbar?: boolean;
}

export interface IActionMenuItem {
    key: string;
    color?: any;
    title: string;
    icon?: JSX.Element;
    callback: (data: any) => void;
    hiddenWhen?: { key: string; values: any[] };
    disabled?: boolean;
    tooltip?: string;
};

export type VariantButton = "text" | "outlined" | "contained";
export type ColorButton = "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
export type ColorText = "primary" | "secondary" | "success" | "error" | "info" | "warning" | "textPrimary" | "textDisabled" | "textSecondary" | string;
