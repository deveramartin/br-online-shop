namespace ApiOos.Models;

public enum PaymentMethod
{
    CashOnDelivery,
    CreditCard,
    MockPayment
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}
