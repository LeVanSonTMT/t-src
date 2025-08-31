using MyApiDotnet8.Datas.Entitis;

namespace MyApiDotnet8.Datas.Interfaces;

public interface ICodeNameRepository
{
    Task<IEnumerable<CodeNameEntity>> GetAll(string? parentCode);
    Task<IEnumerable<CodeNameEntity>> GetPaged(string? parentCode, string? searchText, int? pageSize, int? pageNumber);
    Task<CodeNameEntity?> GetById(string id);
    Task<CodeNameEntity?> GetByCode(string code);
    Task<string> Insert(CodeNameEntity user);
    Task<string> Update(CodeNameEntity user);
    Task<string> Delete(string id);
}
