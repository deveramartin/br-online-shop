namespace ApiOos.Data.Seed;

using ApiOos.Data;
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
                Name = "Signature BR Heritage Hoodie",
                Description = "Premium heavyweight cotton hoodie featuring subtle embroidered logo, relaxed fit, and ultra-soft fleece lining.",
                Price = 89.99m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 45,
                Category = ProductCategory.Apparel,
                SKU = "BR-HOOD-001",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Minimalist BR Canvas Tote",
                Description = "Durable organic canvas tote bag crafted with reinforced stitching and interior zip pocket for daily essentials.",
                Price = 34.50m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 120,
                Category = ProductCategory.Accessories,
                SKU = "BR-TOTE-002",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Limited Edition BR Brass Keyring",
                Description = "Hand-polished solid brass keyring engraved with the iconic BR crest. Designed to age gracefully over time.",
                Price = 24.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1628149455678-16f37bc392f4?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 8,
                Category = ProductCategory.Collectibles,
                SKU = "BR-KEY-003",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "BR Urban Runner Sneakers",
                Description = "Lightweight breathable mesh sneakers with ergonomic cushioning and high-grip rubber outsole for active urban lifestyle.",
                Price = 129.99m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 25,
                Category = ProductCategory.Footwear,
                SKU = "BR-SHOE-004",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Insulated Stainless Steel Flask (750ml)",
                Description = "Double-wall vacuum insulated water bottle keeping beverages cold for 24 hours or hot for 12 hours.",
                Price = 38.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 60,
                Category = ProductCategory.Equipment,
                SKU = "BR-FLSK-005",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "BR Oversized Graphic Tee",
                Description = "Soft ring-spun combed cotton t-shirt with custom silkscreen printed artwork on front and back.",
                Price = 42.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 85,
                Category = ProductCategory.Apparel,
                SKU = "BR-TEE-006",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                Name = "Leather Card Holder & Wallet",
                Description = "Full-grain Italian leather cardholder featuring 4 card slots, central cash compartment, and RFID blocking protection.",
                Price = 49.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 30,
                Category = ProductCategory.Accessories,
                SKU = "BR-WLT-007",
                IsActive = true
            },
            new()
            {
                Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                Name = "Commuter Rolltop Backpack",
                Description = "Weatherproof rolltop backpack with padded 16-inch laptop sleeve, ergonomic shoulder straps, and modular side pockets.",
                Price = 110.00m,
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
                },
                Stock = 18,
                Category = ProductCategory.Equipment,
                SKU = "BR-BAG-008",
                IsActive = true
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}
