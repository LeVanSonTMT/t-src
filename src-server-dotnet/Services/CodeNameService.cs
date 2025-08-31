using MyApiDotnet8.Models.Requests;
using MyApiDotnet8.Datas.Interfaces;
using MyApiDotnet8.Datas.Entitis;

namespace MyApiDotnet8.Services;

public class CodeNameService : ICodeNameService
{
    private readonly ICodeNameRepository _repo;

    public CodeNameService(ICodeNameRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<CodeNameEntity>> GetAll(string? parentCode)
    {
        var items = await _repo.GetAll(parentCode);
        return items;
    }

    public async Task<(IEnumerable<CodeNameEntity> items, int total)> GetPaged(string? parentCode, string? searchText, int? pageSize, int? pageNumber)
    {
        var items = await _repo.GetPaged(
            pageSize: pageSize,
            pageNumber: pageNumber,
            parentCode: parentCode,
            searchText: searchText
        );

        return (items, total: 0);
    }

    public Task<CodeNameEntity?> GetById(string id) => _repo.GetById(id);

    public Task<CodeNameEntity?> GetByCode(string code) => _repo.GetByCode(code);

    public async Task<CodeNameEntity> Create(CreateCodeNameRequests dto)
    {
        var data = new CodeNameEntity
        {
            Name = dto.Name.Trim(),
            Code = dto.Code.Trim(),
        };

        var result = await _repo.Insert(data);

        data.Id = result;

        return data;
    }

    public async Task<string> Update(string id, UpdateCodeNameRequests dto)
    {
        var existing = await _repo.GetById(id);
        if (existing is null)
        {
            return id;
        }
        else
        {
            existing.Name = dto.Name.Trim();
            existing.Code = dto.Code.Trim();

            return await _repo.Update(existing);
        }
    }

    public Task<string> Delete(string id)
    {
        return _repo.Delete(id);
    }
}
