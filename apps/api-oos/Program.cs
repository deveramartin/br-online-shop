using ApiOos.Extensions;
using ApiOos.Helpers;
using ApiOos.Middleware;
using Microsoft.EntityFrameworkCore;
using Serilog;

EnvLoader.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddDomainServices();
builder.Services.AddAuthServices(builder.Configuration);
builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddSwaggerServices();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BR Online Shop API v1");
    });
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApiOos.Data.AppDbContext>();
    await dbContext.Database.MigrateAsync();
    await ApiOos.Data.Seed.SeedData.InitializeAsync(dbContext);
}

app.Run();
