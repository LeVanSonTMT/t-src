using Dapper;
using System.Text;
using MyApiDotnet8.Datas;
using MyApiDotnet8.Datas.Entitis;
using MyApiDotnet8.Datas.Interfaces;

namespace MyApiDotnet8.Datas.Repositories;

public class CodeNameRepository : ICodeNameRepository
{
    private readonly IDbConnectionFactory _factory;

    public CodeNameRepository(IDbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<CodeNameEntity>> GetAll(string? parentCode)
    {
        using var conn = _factory.CreateConnection();

        var sql = new StringBuilder(@"
            SELECT *
            FROM CodeNameCommon
        ");

        if (!string.IsNullOrWhiteSpace(parentCode))
            sql.Append(" WHERE ParentCode = @ParentCode ");

        return await conn.QueryAsync<CodeNameEntity>(sql.ToString(), new { ParentCode = parentCode });
    }

    public async Task<IEnumerable<CodeNameEntity>> GetPaged(string? parentCode, string? searchText, int? pageSize, int? pageNumber)
    {
        using var conn = _factory.CreateConnection();
        var offset = (pageNumber - 1) * pageSize;

        var sql = new StringBuilder(@"
            SELECT *
            FROM CodeNameCommon
        ");

        if (!string.IsNullOrWhiteSpace(searchText))
            sql.Append(" WHERE Name LIKE @kw OR Email LIKE @kw ");
        if (!string.IsNullOrWhiteSpace(parentCode))
            sql.Append(" WHERE ParentCode = @ParentCode");

        sql.Append(" ORDER BY Id DESC LIMIT @pageSize OFFSET @offset;");

        return await conn.QueryAsync<CodeNameEntity>(sql.ToString(), new
        {
            pageSize,
            offset,
            kw = $"%{searchText?.Trim()}%",
            ParentCode = parentCode,
        });
    }

    public async Task<CodeNameEntity?> GetById(string id)
    {
        using var conn = _factory.CreateConnection();
        const string sql = @"SELECT * FROM CodeNameCommon WHERE id = @Id;";
        return await conn.QueryFirstOrDefaultAsync<CodeNameEntity>(sql, new { Id = id });
    }

    public async Task<CodeNameEntity?> GetByCode(string code)
    {
        using var conn = _factory.CreateConnection();
        const string sql = @"SELECT * FROM CodeNameCommon WHERE code = @Code;";
        return await conn.QueryFirstOrDefaultAsync<CodeNameEntity>(sql, new { Code = code });
    }

    public async Task<string> Insert(CodeNameEntity user)
    {
        using var conn = _factory.CreateConnection();

        const string sql = @"
            INSERT INTO CodeNameCommon (name, code, parentCode)
            VALUES (@Name, @Code, @ParentCode);
            SELECT LAST_INSERT_ID();";

        var result = await conn.ExecuteScalarAsync<string>(sql, user);

        return result ?? "";
    }

    public async Task<string> Update(CodeNameEntity user)
    {
        using var conn = _factory.CreateConnection();
        const string sql = @"
            UPDATE CodeNameCommon
            SET name = @Name, code = @Code
            WHERE id = @Id;";
        var rows = await conn.ExecuteAsync(sql, user);
        return (rows > 0) ? (user?.Id ?? "") : "";
    }

    public async Task<string> Delete(string id)
    {
        using var conn = _factory.CreateConnection();
        const string sql = @"DELETE FROM CodeNameCommon WHERE id = @Id;";
        var rows = await conn.ExecuteAsync(sql, new { Id = id });
        return rows > 0 ? id : "";
    }
}
