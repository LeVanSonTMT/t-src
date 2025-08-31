import { extend } from "lodash";

export interface IRequestGetPage {
    searchText?: string;

    pageSize?: number;
    pageNumber?: number;
}

export interface IGetPaged<T = any> {
    pageSize: number;
    currentPage: number;

    totalPages: number;
    totalCounts: number;

    hasNext: boolean;
    hasPrevious: boolean;

    items: T[];
    selectedItems?: T[];
}

// CodeName
export interface IRequestGetAllCodeName {
    ids?: string[];
    codes?: string[];
    isParent?: number;
    parentCode?: string;
}

export interface IRequestGetPageCodeName {
    isParent?: number;
    parentCode?: string;
    searchText?: string;

    pageSize: number;
    pageNumber: number;
}

export interface IRequestCodeName {
    id?: string;
    code?: string;
    name?: string;
    parentCode?: string;
    description?: string;
    updateTime?: string;
}

//
export interface IRequestGetPageLogs {
    action?: any;
    byUser?: string;
    endTime?: string;
    startTime?: string;

    targetId?: string;

    pageSize: number;
    pageNumber: number;
}

export interface IRequestCreateLogs {
    action: number;
    targetId: string;
    dataChanges: string;
}

export interface IDataChanges {
    [key: string]: {
        oldValue?: any;
        newValue?: any;
    };
};

// System Settings
export interface IRequestSetting {
    id?: string;
    settingCode?: string;
    settingValue?: string;
    description?: string;
    updateTime?: string;
}

// Role
export interface IRequestGetPageRole {
    searchText?: string;

    pageSize?: number;
    pageNumber?: number;
}

export interface IRequestRole {
    id?: string;
    code: string;
    name: string;
    updateTime?: string;
    description?: string;
}

// Module Permission
export interface IRequestModulePermission {
    id?: string;
    role: string;
    module: string;
    permission?: number;
    updateTime?: string;
}

// Module
export interface IRequestGetPageModule {
    searchText?: string;

    pageSize?: number;
    pageNumber?: number;
}

export interface IRequestModule {
    id?: string;
    code: string;
    name: string;
    updateTime?: string;
    description?: string;
}

// Module Resource
export interface IRequestModuleResource {
    id?: string;
    module: string;
    resource: string;
    permission?: number;
    updateTime?: string;
}

// Resource
export interface IRequestGetPageResource {
    method?: string;
    searchText?: string;
    pageSize?: number;
    pageNumber?: number;
}

export interface IRequestResource {
    id?: string;
    code: string;
    name: string;
    uri?: string;
    method?: string;
    updateTime?: string;
    description?: string;
}

// Document
export interface IRequestDocument {
    id?: string;
    url?: string;
    type?: string;
    name?: string;
    targetId?: string;
    updateTime?: string;
    description?: string;
}