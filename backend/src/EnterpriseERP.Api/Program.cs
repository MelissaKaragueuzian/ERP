var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var developmentOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()?
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray() ?? [];

var useDevelopmentCors = builder.Environment.IsDevelopment() && developmentOrigins.Length > 0;

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddOpenApi();
}

if (useDevelopmentCors)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("DevelopmentFrontend", policy =>
        {
            policy.WithOrigins(developmentOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

if (useDevelopmentCors)
{
    app.UseCors("DevelopmentFrontend");
}

app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program;
