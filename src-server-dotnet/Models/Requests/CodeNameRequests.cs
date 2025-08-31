using System.ComponentModel.DataAnnotations;

namespace MyApiDotnet8.Models.Requests;

public class CreateCodeNameRequests
{

    [Required, StringLength(500)]
    public string Name { get; set; } = "";

    [Required, StringLength(20)]
    public string Code { get; set; } = "";

    [StringLength(20)]
    public string ParentCode { get; set; } = "";
}

public class UpdateCodeNameRequests
{
    public string Id { get; set; } = "";

    [Required, StringLength(500)]
    public string Name { get; set; } = "";

    [Required, StringLength(20)]
    public string Code { get; set; } = "";

    [StringLength(20)]
    public string ParentCode { get; set; } = "";
}