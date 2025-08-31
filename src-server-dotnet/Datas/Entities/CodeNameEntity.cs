using MyApiDotnet8.Data.Entities;

namespace MyApiDotnet8.Datas.Entitis;

public class CodeNameEntity : BaseEntity<CodeNameEntity>
{
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public string ParentCode { get; set; } = "";
    public string Description { get; set; } = "";


}

