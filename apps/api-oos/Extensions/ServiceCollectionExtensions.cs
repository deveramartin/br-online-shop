namespace ApiOos.Extensions;

using System.Text;
using ApiOos.Configurations;
using ApiOos.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(connectionString));
        }
        return services;
    }

    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        services.AddScoped<ApiOos.Helpers.JwtTokenHelper>();
        services.AddScoped<ApiOos.Interfaces.Repositories.IUserRepository, ApiOos.Repositories.UserRepository>();
        services.AddScoped<ApiOos.Interfaces.Repositories.IProductRepository, ApiOos.Repositories.ProductRepository>();
        services.AddScoped<ApiOos.Interfaces.Repositories.ICartRepository, ApiOos.Repositories.CartRepository>();
        services.AddScoped<ApiOos.Interfaces.Repositories.IOrderRepository, ApiOos.Repositories.OrderRepository>();
        services.AddScoped<ApiOos.Interfaces.Repositories.IContactInquiryRepository, ApiOos.Repositories.ContactInquiryRepository>();
        services.AddScoped<ApiOos.Interfaces.Repositories.IReviewRepository, ApiOos.Repositories.ReviewRepository>();
        services.AddScoped<ApiOos.Interfaces.Services.IAuthService, ApiOos.Services.AuthService>();
        services.AddScoped<ApiOos.Interfaces.Services.IUserService, ApiOos.Services.UserService>();
        services.AddScoped<ApiOos.Interfaces.Services.IProductService, ApiOos.Services.ProductService>();
        services.AddScoped<ApiOos.Interfaces.Services.ICartService, ApiOos.Services.CartService>();
        services.AddScoped<ApiOos.Interfaces.Services.IOrderService, ApiOos.Services.OrderService>();
        services.AddScoped<ApiOos.Interfaces.Services.IContactService, ApiOos.Services.ContactService>();
        services.AddScoped<ApiOos.Interfaces.Services.ISentraCxService, ApiOos.Services.SentraCxService>();
        services.AddScoped<ApiOos.Interfaces.Services.IReviewService, ApiOos.Services.ReviewService>();
        services.AddScoped<ApiOos.Interfaces.Services.IAiAnalyticsService, ApiOos.Services.AiAnalyticsService>();

        services.AddHttpClient("SentraCX", (sp, client) =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var crmUrl = config["SentraCX:ApiUrl"] ?? "http://localhost:5005";
            client.BaseAddress = new Uri(crmUrl);
        }).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        });

        services.AddHttpClient("AiAnalytics", (sp, client) =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var aiUrl = config["AiAnalytics:ApiUrl"] ?? "http://localhost:4005";
            client.BaseAddress = new Uri(aiUrl);
        }).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        });

        return services;

    }

    public static IServiceCollection AddAuthServices(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

        var key = Encoding.UTF8.GetBytes(string.IsNullOrEmpty(jwtSettings.SecretKey) 
            ? "default-super-secret-key-that-is-at-least-256-bits-long!" 
            : jwtSettings.SecretKey);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = !string.IsNullOrEmpty(jwtSettings.Issuer),
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = !string.IsNullOrEmpty(jwtSettings.Audience),
                ValidAudience = jwtSettings.Audience,
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? 
                             ["http://localhost:3000", "http://localhost:3004"];

        services.AddCors(options =>
        {
            options.AddPolicy("DefaultCorsPolicy", builder =>
            {
                builder.WithOrigins(allowedOrigins)
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            });
        });

        return services;
    }

    public static IServiceCollection AddSwaggerServices(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "BR Online Shop & OOS API",
                Version = "v1",
                Description = "ASP.NET Core Web API for Bren Raphael's Ube Jam & Halaya Shop"
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}
