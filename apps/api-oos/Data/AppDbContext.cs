namespace ApiOos.Data;

using ApiOos.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.FullName).IsRequired().HasMaxLength(100);
            e.Property(u => u.Email).IsRequired().HasMaxLength(256);
            e.Property(u => u.PasswordHash).IsRequired();
            e.HasMany(u => u.Addresses)
             .WithOne(a => a.User)
             .HasForeignKey(a => a.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Address>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.Label).IsRequired().HasMaxLength(50);
            e.Property(a => a.Street).IsRequired().HasMaxLength(200);
            e.Property(a => a.City).IsRequired().HasMaxLength(100);
            e.Property(a => a.Province).IsRequired().HasMaxLength(100);
            e.Property(a => a.PostalCode).IsRequired().HasMaxLength(20);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasIndex(p => p.SKU).IsUnique();
            e.Property(p => p.Name).IsRequired().HasMaxLength(150);
            e.Property(p => p.Description).IsRequired().HasMaxLength(2000);
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.SKU).IsRequired().HasMaxLength(50);
            e.Property(p => p.Category).HasConversion<string>();
            e.Property(p => p.Images).HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
        });
    }
}
