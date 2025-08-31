// PUBLIC
export enum AvailableLanguage {
    Vietnamese = "vi",
    English = "en",
}

export enum BooleanInt {
    False = 0,
    True = 1,
}

export enum Mode {
    Create = 0,
    Update = 1,
    View = 2,
}

export enum Status {
    Deleted = -9,
    Blocked = -2,
    Cancel = -3,
    Reject = -4,
    Draft = -1,
    Inactive = 0,
    Active = 1,
}

export enum ActionRequest {
    Create = 1,
    Update = 2,
    Delete = 3,
}

export enum Method {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export enum Permission {
    READ = 1,
    CREATE = 2,
    UPDATE = 4,
    DELETE = 8,
    DOWNLOAD = 16,
    PRINT = 64,
    EXPORT = 128,
    IMPORT = 256,
}