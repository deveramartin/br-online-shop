namespace ApiOos.DTOs.Requests.Orders;

public class ShippingAddressRequest
{
    public string RecipientName { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class CreateOrderRequest
{
    public ShippingAddressRequest ShippingAddress { get; set; } = null!;
    public ApiOos.Models.PaymentMethod PaymentMethod { get; set; } = ApiOos.Models.PaymentMethod.CashOnDelivery;
}
