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
            context.Products.RemoveRange(await context.Products.ToListAsync());
            await context.SaveChangesAsync();
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA7S0hOC0LULqO91-rl539U8hW6W8YHNgRkNwcNfsgOHFk75mKV-zXuYzOIVF2BDosdkZN-PHcVhTfU6PyMFa5Nj1pf5jbyxZfv3AUDc3u1-WL7fHPnf0ODhU4ipqdk8pJ-bXdgWL1kqAlCHHGsM7-4jLb6KcAzH1gLCCayCa0JdQUzCcnAkSobG9ZLLQ5p0KqjhDUf0KBdzzt4m1F8BynKNZA4N4IMUnxIOHjp95T93CjkRtivTN-5",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3yUXftAsduQpns2VFfZxyzvRH7rKVfhtSfudiZW7x1YCElWFE9-yBEDV8urc7FXWioId055_fiZcvRz5cz61v9zhXwAzweB9gJAY7qJIpEFT042outaY86L37VA6oWfKpB-6vrx6TLOKPvgSO9s8dmeUmiI1eDueMM207mLrp_H_osedrtv25zhNZVzJ_vrL6wEgMQ1XQnQNe1Zc1pqrFfEM5QWg12cMRSMOMkr8Wxduh8ksRTzDU"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCvYorp5_W1eCA7NZlj3bK5QcB3G4nbw1xHSAVwVBYzkiqHYGC_fwAjqleHTM_EfxiOf9YFNIN_8RulAN4rvk6uNLHb0zZlCH7nveUb-pFa2s4a2SAq5-2qQATFGGVyPa0LUGtxjwBBDT5nnNBjqiDPQ28DNjFYI2DXA_-esTTzQpKtVEdGCkimjOGhgkTd69b3shvjS9uV7f5kW4F4ieMObtJG6xXWis-x5lzvXuSWpps59XgzJVqf"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuATshMwg4eB2EKVsRyXIdZylqZRucr8U_2Q1p4P9EOwIErxhI9EWt4z9R0ZvjQ5Z_JiuqlYIqEmDY5kVeEaJBp4Y2IQkBiSaDdU86fAJ9WiK2QVTCtsGIFog5CXea1zjI_ugxLwLiMCBMbRqG07imMOzkilpAtLUkiRPjC3vF8BiIDfRc-xkJj8_WmcjtX5Ktj3NwkbNoYCqMtIbbKe53UWRwH4NNCdi_2dPQlPhZ2_mV8cIDVzRLWJ"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBXOac8vhhCxugS9pCZo1OZ0WnhWtRYXCuhpZBD6Khg-aSBcB6PNwX1HzgdfzCDwZVtmOITzPMci7shnMuxnfs4wLfHWZS2p7j14VWd0HGgLJFP2idebnrGdvzF4F-WLYgdlg3ehhu2Rp-PHZ9pz7uvCktFZhiQ7mOm7C4aDFe8VCOCsMbwlIw2FH-YIX906Y31UgBRiOHZrXdEuKZqtlc-Iv-HwvqkOOjPuqn5eBOmPwe7RwfeC7f3"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBUJCDWh1tUyA4w-xprhHKWdagHC2O0pKk0a3Xl2bDyDsb2liRxSzcrwLhf5Jja1H8DBz_onNjS5xS0jiwnLf9gWUGf49nxKMQ8GvgLpjlNtS8hWNBuPAF08LEwXktDN4dpkpaRjxvA3xEqnOgzwj2ORadAYsD_MK07CxWTkNrr8TnLvmMijYNbgxDzNmX9x34lNVPhnqvajyOyxY8kKoNliacmrY1zkfp9Tq435MqXPviOZcE4dVXS"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAL_dXnXusHqi-bysqmxbpt81Uc7oKx5I7f_H7hs75ZprnCBHRA-EMSmdHpeGI1qelU172WGVjA1SXAn5vuvHE66IVuQKTky6phu6hD7Ho9CzjascHumBL6orptvT7AbKVwyOm-THbcchSEdkJW5CYZRq13OiY7qPSRzBmXhX0E3phIQRQp88_e2mswpEJxu7RSIoZDmDBawal5glhmHxqovzXWDy8ov6QFPlA0dVsV8FQy-ng7qVaY"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCF21Q3w514zZ2zwUwNl2N0noQow9WDneEJstbXLkrDY79hQYQdNgcBv9gQhCm2zOYT54b1SMiE61gZfg5_JEZRupwIvfCMblHHC6er0jMYVBu3cydLKuKVStFQieUTQ7_9nFzsBTi_m4NMZ3z0Mk2Q7Hd6Rh2HjWYtdU6I8sq_tzoMeRIO9aEVXYXoLeSapYTfevIa_kIal590HJQ4Qy8-MZbxgachkebguUp-Cn2C51SkQAY0IjGy"
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
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuChCwb0gUpb9yEVEt_Rb9AQV375kgfxtC19pBmAoiP6MmC4EDK5dqPZd5S3fzyxIzgstytcUHiPBSYfNTeCQvofKH85M7TDC1TG1lT6L8xAmKuWK6JfzMqG6v5DwRzd3sUN4pms5N806jkGuvYapOIlyEcfVQbEFuvBix4N4TnsCls-OM6wj58gF-ulFTD_68gQtrYl4jU5HOQbUAX12-W5ymsgpgcQV3T1lL0tTmuPeYkukiaFkFj2"
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
