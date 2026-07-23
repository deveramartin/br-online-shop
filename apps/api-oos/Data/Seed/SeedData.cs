namespace ApiOos.Data.Seed;

using ApiOos.Data;
using ApiOos.Enums;
using ApiOos.Models;

using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (await context.Products.AnyAsync())
        {
            return;
        }

        var products = new List<Product>
        {
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Classic Ube Halaya",
                Description = "Smooth, creamy, and slow-cooked for 8 hours for maximum richness using premium purple yams.",
                Price = 350.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 50,
                Category = ProductCategory.Jams,
                SKU = "UBE-HAL-001",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Ube Crinkle Cookies",
                Description = "Soft-baked cookies infused with real ube and dusted with powdered sugar.",
                Price = 220.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 80,
                Category = ProductCategory.Pastries,
                SKU = "UBE-CRK-002",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Chunky Ube Jam",
                Description = "Extra textured jam with real bits of purple yam for a rustic homemade feel.",
                Price = 380.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 35,
                Category = ProductCategory.Jams,
                SKU = "UBE-CHK-003",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Assorted Ube Box",
                Description = "A curated selection of our best-selling ube pastries, tarts, and candies.",
                Price = 550.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 20,
                Category = ProductCategory.GiftSets,
                SKU = "UBE-BOX-004",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Ube Halaya w/ Cheese",
                Description = "The perfect balance of sweet purple yam jam topped with rich savory cheese.",
                Price = 375.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 40,
                Category = ProductCategory.Jams,
                SKU = "UBE-CHS-005",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "Golden Ube Tarts",
                Description = "Mini tarts with a flaky butter crust and velvet ube filling.",
                Price = 280.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 60,
                Category = ProductCategory.Pastries,
                SKU = "UBE-TRT-006",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Name = "Ube Macapuno Mix",
                Description = "Enriched with coconut macapuno strings for an authentic tropical twist.",
                Price = 365.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 45,
                Category = ProductCategory.Jams,
                SKU = "UBE-MAC-007",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                Name = "Creamy Ube Pastillas",
                Description = "Milk-based purple yam candies that melt in your mouth.",
                Price = 180.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 90,
                Category = ProductCategory.Sweets,
                SKU = "UBE-PST-008",
                IsActive = true
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}
