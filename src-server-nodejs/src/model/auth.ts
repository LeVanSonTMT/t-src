

export interface IRequestAccountByJWT {
    fullName: string;
    roleCode: string;
    accountId: string;
    accountCode: string;
}

export interface IResponseAccount {
    id: string
    roleCode: string;
    password: string;
    fullName: string;
    accountCode: string;
    needChangePW: number;

    status: number;
    createTime?: string;
    updateTime?: string;
    createUser?: string;
    updateUser?: string;
}

export namespace IRequestCreateAcount {
    export interface IController {
        roleCode?: string;
        fullName?: string;
        accountCode: string;
    }

    export interface IService {
        roleCode: string;
        password: string;
        fullName: string;
        accountCode: string;
    }
}

export namespace IRequestUpdateAcount {
    export interface IController {
        id: string;
        roleCode?: string;
        fullName?: string;
        accountCode: string;
        updateTime?: string;
    }

    export interface IService {
        id: string;
        roleCode: string;
        fullName: string;
        accountCode: string;
        updateTime?: string;
    }
}

export interface IRequestGetPageAccount {
    searchText?: string;
    departmentId?: string;

    pageSize?: number;
    pageNumber?: number;
}
