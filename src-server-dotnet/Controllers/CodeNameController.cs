using Microsoft.AspNetCore.Mvc;

using MyApiDotnet8.Services;
using MyApiDotnet8.Models.Requests;
using Microsoft.AspNetCore.Authorization;



namespace MyApiDotnet8.Controllers;


// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class CodeNameController : Controller
{
    private readonly ICodeNameService _service;
    private readonly ILogger<CodeNameController> _logger;

    public CodeNameController(
        IConfiguration config,
        ICodeNameService service,
        ILogger<CodeNameController> logger
    )
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("GetAll")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] string? parentCode = null)
    {
        var items = await _service.GetAll(parentCode);
        return Ok(new { items });
    }


    [HttpGet("GetPaged")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int size = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? parentCode = null
    )
    {
        var pageNumber = Math.Max(1, page);
        var pageSize = Math.Clamp(size, 1, 200);

        var (items, total) = await _service.GetPaged(
            searchText: search,
            pageSize: pageSize,
            parentCode: parentCode,
            pageNumber: pageNumber
        );

        return Ok(new
        {
            pageNumber,
            pageSize,
            total,
            items
        });
    }


    [HttpGet("GetById/{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(string id)
    {
        var detail = await _service.GetById(id);
        return (detail is null) ? NotFound() : Ok(detail);
    }


    [HttpPost("Create")]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCodeNameRequests dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _service.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }


    [HttpPost("Update")]
    [Authorize]
    public async Task<IActionResult> Update([FromBody] UpdateCodeNameRequests dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var result = await _service.Update(id: dto.Id, dto);

        return Ok(new { id = result });
    }


    [HttpDelete("/Delete/{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _service.Delete(id);

        return Ok(new { id = result });
    }
}
