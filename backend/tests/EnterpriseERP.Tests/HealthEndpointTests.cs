using System.Net;
using System.Net.Http.Json;
using EnterpriseERP.Api.Controllers;
using Microsoft.AspNetCore.Mvc.Testing;

namespace EnterpriseERP.Tests;

public sealed class HealthEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HealthEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetHealth_ReturnsOkAndHealthyPayload()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<HealthResponse>();

        Assert.NotNull(payload);
        Assert.Equal("healthy", payload.Status);
        Assert.Equal("EnterpriseERP", payload.Application);
    }
}
