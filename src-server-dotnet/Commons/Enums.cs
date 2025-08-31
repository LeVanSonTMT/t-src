using System;
using System.ComponentModel;

namespace MyApiDotnet8.Commons.Enums
{
    public enum ResponseMessageEnum
    {
        [Description("Request successful.")]
        Success = 200,
        [Description("Request responded with exceptions.")]
        Exception = 500,
        [Description("Request denied.")]
        UnAuthorized = 401,
        [Description("Request responded with validation error(s).")]
        ValidationError = 400,
        [Description("Unable to process the request.")]
        Failure = 403,
        [Description("Not found.")]
        NotFound = 404,
    }
    public enum MethodHttp
    {
        GET,
        POST,
        PATCH,
        PUT,
        DELETE
    }

    public enum ActionRequest
    {
        Create = 1,
        Update = 2,
        Delete = -1,
    }

    public enum Status
    {
        Deleted = -9,
        Inactive = 0,
        Active = 1,
        Accept = 2,
        Decline = 3
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }
}
