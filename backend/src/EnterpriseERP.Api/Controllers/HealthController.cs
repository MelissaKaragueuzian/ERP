using Microsoft.AspNetCore.Mvc;

namespace EnterpriseERP.Api.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status200OK)]
    public ActionResult<HealthResponse> Get()
    {
        return Ok(new HealthResponse("healthy", "EnterpriseERP"));
    }
}

public sealed record HealthResponse(string Status, string Application);
