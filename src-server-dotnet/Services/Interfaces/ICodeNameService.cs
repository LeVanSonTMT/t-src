using MyApiDotnet8.Datas;
using MyApiDotnet8.Datas.Entitis;
using MyApiDotnet8.Models.Requests;

namespace MyApiDotnet8.Services;

public interface ICodeNameService
{
    Task<IEnumerable<CodeNameEntity>> GetAll(string? parentCode);
    Task<(IEnumerable<CodeNameEntity> items, int total)> GetPaged(string? parentCode, string? searchText, int? pageSize, int? pageNumber);

    Task<CodeNameEntity?> GetById(string id);
    Task<CodeNameEntity?> GetByCode(string code);
    Task<CodeNameEntity> Create(CreateCodeNameRequests dto);
    Task<string> Update(string id, UpdateCodeNameRequests dto);
    Task<string> Delete(string id);
}